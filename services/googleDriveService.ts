import { GoogleFile } from '../types';

// Declaração de tipos para as APIs do Google que são carregadas globalmente.
declare var gapi: any;
declare var google: any;

// Substitua pelo seu Client ID real do Google Cloud Console.
// Para este ambiente, usamos um placeholder.
const CLIENT_ID = '1013982391244-6ocprse69c1qf8h8v28hi1o1n6ms89ep.apps.googleusercontent.com';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const BACKUP_FILE_PREFIX = 'client_manager_backup';
const MAX_BACKUPS = 3;

interface GoogleApiError {
    message: string;
    code: number | null;
}

let tokenClient: any = null;
let gapiLoaded = false;
let gisLoaded = false;

// We replace the flawed top-level promises with functions that create them on demand.
let loadGapiPromise: Promise<void> | null = null;
let loadGisPromise: Promise<void> | null = null;

function getBackupFileName(): string {
    const now = new Date();
    // Format to YYYY-MM-DDTHH_mm_ss to make it sortable and filename-safe
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '_');
    return `${BACKUP_FILE_PREFIX}_${timestamp}.json`;
}


function getLoadGapiPromise() {
    if (!loadGapiPromise) {
        loadGapiPromise = new Promise((resolve, reject) => {
            const checkGapi = () => {
                if (gapi && gapi.load) {
                    gapi.load('client', {
                        callback: resolve,
                        onerror: reject,
                    });
                } else {
                    setTimeout(checkGapi, 100);
                }
            };
            checkGapi();
        });
    }
    return loadGapiPromise;
}

function getLoadGisPromise() {
    if (!loadGisPromise) {
        loadGisPromise = new Promise((resolve) => {
            const checkGis = () => {
                if (google && google.accounts) {
                    resolve();
                } else {
                    setTimeout(checkGis, 100);
                }
            };
            checkGis();
        });
    }
    return loadGisPromise;
}

const parseGoogleApiError = (err: any): GoogleApiError => {
    if (err.result && err.result.error) {
        return {
            message: `Erro do Google: ${err.result.error.message}`,
            code: err.result.error.code
        };
    }
    // Check for top-level code, which can happen sometimes
    if (err.code && err.message) {
        return { message: err.message, code: err.code };
    }
    return {
        message: err.message || "Ocorreu um erro desconhecido na API do Google.",
        code: err.code || null
    };
}

export function isGapiLoaded(): boolean {
    return gapiLoaded && gisLoaded;
}

export async function initGapiClient(updateSigninStatus: (isSignedIn: boolean) => void) {
    try {
        await getLoadGapiPromise();
        await gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
        });
        gapiLoaded = true;

        await getLoadGisPromise();
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.error) {
                    console.error("Erro de autorização do Google:", tokenResponse.error);
                    updateSigninStatus(false);
                } else if (tokenResponse && tokenResponse.access_token) {
                     updateSigninStatus(true);
                } else {
                     console.error("Nenhum token de acesso encontrado na resposta.");
                     updateSigninStatus(false);
                }
            },
        });
        gisLoaded = true;
    } catch (err) {
        console.error("Falha ao inicializar o cliente GAPI:", err);
        throw err;
    }
}

export function getToken() {
    if (gapi && gapi.client && typeof gapi.client.getToken === 'function') {
        return gapi.client.getToken();
    }
    return null;
}

export function signIn() {
    if (!tokenClient) {
        console.error("Cliente Google Identity Services não inicializado.");
        return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
}

export function signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken(null);
        });
    }
}

export async function listBackupFiles(): Promise<GoogleFile[]> {
    try {
        const response = await gapi.client.drive.files.list({
            q: `name contains '${BACKUP_FILE_PREFIX}' and trashed=false`,
            spaces: 'drive',
            fields: 'files(id, name, modifiedTime)',
            orderBy: 'name desc',
        });
        
        return response.result.files || [];
    } catch (err) {
        const parsedError = parseGoogleApiError(err);
        console.error("Erro ao listar arquivos de backup:", parsedError);
        throw parsedError;
    }
}

async function cleanupOldBackups(): Promise<void> {
    try {
        const files = await listBackupFiles();
        if (files.length > MAX_BACKUPS) {
            // Files are already sorted newest to oldest by the API query (orderBy: 'name desc')
            const filesToDelete = files.slice(MAX_BACKUPS);
            for (const file of filesToDelete) {
                console.log(`Deleting old backup: ${file.name}`);
                await gapi.client.drive.files.delete({ fileId: file.id });
            }
        }
    } catch(err) {
        const parsedError = parseGoogleApiError(err);
        console.error("Falha ao limpar backups antigos:", parsedError);
        // Don't throw, cleanup failure is not critical
    }
}

export async function uploadBackup(content: string): Promise<GoogleFile> {
    try {
        const fileName = getBackupFileName();
        const fileMetadata = {
            'name': fileName,
            'mimeType': 'application/json',
        };
        
        const media = {
            mimeType: 'application/json',
            body: content,
        };
        
        const response = await gapi.client.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name, modifiedTime',
        });

        // Cleanup old backups after a successful upload
        await cleanupOldBackups();

        return response.result;
        
    } catch (err) {
        const parsedError = parseGoogleApiError(err);
        console.error("Erro ao fazer upload do backup:", parsedError);
        throw parsedError;
    }
}

export async function getBackupContent(fileId: string): Promise<string> {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media',
        });
        return response.body;
    } catch (err) {
        const parsedError = parseGoogleApiError(err);
        console.error("Erro ao obter conteúdo do backup:", parsedError);
        throw parsedError;
    }
}
import * as vscode from 'vscode';

export class FileUtils {
    // Make methods static since they don't rely on instance state
    public static async createDirectory(uri: vscode.Uri): Promise<void> {
        try {
            await vscode.workspace.fs.createDirectory(uri);
        } catch (error) {
            console.error('Failed to create directory:', error);
            throw new Error(`Directory creation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public static async writeFile(uri: vscode.Uri, content: string): Promise<void> {
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
        } catch (error) {
            console.error('Failed to write file:', error);
            throw new Error(`File write failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public static async readFile(uri: vscode.Uri): Promise<string> {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(fileData).toString('utf-8');
        } catch (error) {
            console.error('Failed to read file:', error);
            throw new Error(`File read failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
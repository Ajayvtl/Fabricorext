import * as vscode from 'vscode';
import { AIGateway } from '../ai/gateway';
import { FileUtils } from '../utils/fileUtils';

export class ProjectGenerator {
    constructor(
        private aiGateway: AIGateway
        // Remove fileUtils from constructor since methods are static
    ) { }

    public async generateFromPrototype(prototype: any, basePath: vscode.Uri) {
        try {
            // Validate prototype structure
            if (!this._validatePrototype(prototype)) {
                throw new Error('Invalid prototype structure');
            }

            // Create directory structure using static method
            await FileUtils.createDirectory(basePath);

            // Generate files
            await this._generateProjectFiles(prototype, basePath);

            vscode.window.showInformationMessage(
                `Project ${prototype.name} generated successfully!`
            );
        } catch (error) {
            vscode.window.showErrorMessage(
                `Project generation failed: ${error instanceof Error ? error.message : String(error)}`
            );
            console.error('Project generation error:', error);
        }
    }

    private _validatePrototype(prototype: any): boolean {
        return prototype &&
            typeof prototype === 'object' &&
            'name' in prototype &&
            'files' in prototype;
    }

    private async _generateProjectFiles(prototype: any, basePath: vscode.Uri) {
        await Promise.all(
            prototype.files.map(async (file: any) => {
                const filePath = vscode.Uri.joinPath(basePath, file.path);
                // Use static method
                await FileUtils.writeFile(filePath, file.content);
            })
        );
    }
}
import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { ChatPanel } from './ui/chatPanel';
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activated!'); // Check this appears in Debug Console

    context.subscriptions.push(
        vscode.commands.registerCommand('ai-dev-assistant.activate', () => {
            console.log('Command triggered!'); // Verify this logs
            ChatPanel.createOrShow(context);
        })
    );
}

export function deactivate() {
    console.log('AI Dev Assistant deactivated');
}

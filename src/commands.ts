import * as vscode from 'vscode';
import { ChatPanel } from './ui/chatPanel';

export function registerCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-dev-assistant.activate', () => {
            ChatPanel.createOrShow(context);
        })
    );
}
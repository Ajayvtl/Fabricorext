import * as vscode from 'vscode';
import { ChatPanel } from './ui/chatPanel';
import { AIGateway } from './ai/gateway'; // Adjust the path if needed

export function registerCommands(context: vscode.ExtensionContext) {
    const aiGateway = new AIGateway(context.secrets); // ✅ Create the gateway instance

    context.subscriptions.push(
        vscode.commands.registerCommand('ai-dev-assistant.activate', () => {
            ChatPanel.createOrShow(context, aiGateway); // ✅ Pass both context and aiGateway
        })
    );
}
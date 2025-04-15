"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const vscode = __importStar(require("vscode"));
class FileUtils {
    // Make methods static since they don't rely on instance state
    static async createDirectory(uri) {
        try {
            await vscode.workspace.fs.createDirectory(uri);
        }
        catch (error) {
            console.error('Failed to create directory:', error);
            throw new Error(`Directory creation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async writeFile(uri, content) {
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
        }
        catch (error) {
            console.error('Failed to write file:', error);
            throw new Error(`File write failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async readFile(uri) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(fileData).toString('utf-8');
        }
        catch (error) {
            console.error('Failed to read file:', error);
            throw new Error(`File read failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=fileUtils.js.map
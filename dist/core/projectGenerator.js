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
exports.ProjectGenerator = void 0;
const vscode = __importStar(require("vscode"));
const fileUtils_1 = require("../utils/fileUtils");
class ProjectGenerator {
    constructor(aiGateway
    // Remove fileUtils from constructor since methods are static
    ) {
        this.aiGateway = aiGateway;
    }
    async generateFromPrototype(prototype, basePath) {
        try {
            // Validate prototype structure
            if (!this._validatePrototype(prototype)) {
                throw new Error('Invalid prototype structure');
            }
            // Create directory structure using static method
            await fileUtils_1.FileUtils.createDirectory(basePath);
            // Generate files
            await this._generateProjectFiles(prototype, basePath);
            vscode.window.showInformationMessage(`Project ${prototype.name} generated successfully!`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Project generation failed: ${error instanceof Error ? error.message : String(error)}`);
            console.error('Project generation error:', error);
        }
    }
    _validatePrototype(prototype) {
        return prototype &&
            typeof prototype === 'object' &&
            'name' in prototype &&
            'files' in prototype;
    }
    async _generateProjectFiles(prototype, basePath) {
        await Promise.all(prototype.files.map(async (file) => {
            const filePath = vscode.Uri.joinPath(basePath, file.path);
            // Use static method
            await fileUtils_1.FileUtils.writeFile(filePath, file.content);
        }));
    }
}
exports.ProjectGenerator = ProjectGenerator;
//# sourceMappingURL=projectGenerator.js.map
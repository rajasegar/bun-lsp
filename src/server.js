#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("vscode-languageserver/node");
var vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
var connection = (0, node_1.createConnection)(process.stdin, process.stdout);
var documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
var hasConfigurationCapability = false;
var hasWorkspaceFolderCapability = false;
connection.onInitialize(function () {
    // const capabilities = params.capabilities;
    // Check if the client supports configuration
    // hasConfigurationCapability = capabilities.workspace && !!capabilities.workspace.configuration;
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["Bun."]
            },
            hoverProvider: true,
        },
    };
});
connection.onInitialized(function () {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(function (_event) {
            connection.console.log("Workspace folder change event received.");
        });
    }
});
connection.onCompletion(function (_textDocumentPosition) {
    // For simplicity, this example returns the same completion items for all positions.
    return [
        {
            label: 'serve',
            kind: node_1.CompletionItemKind.Method,
            data: 1,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: "Start an HTTP server"
            }
        },
        {
            label: 'file',
            kind: node_1.CompletionItemKind.Method,
            data: 1,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: "Reading files"
            }
        },
        {
            label: 'write',
            kind: node_1.CompletionItemKind.Method,
            data: 1,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: "Writing files"
            }
        },
    ];
    /*
    return htmlAttributes.map((attr) => {
      return {
        label: attr.name,
        kind: CompletionItemKind.Text,
        data: 1,
        documentation: {
          kind: MarkupKind.Markdown, // 'plaintext' is also supported
          value: attr.documentation,
        },
      } as CompletionItem;
    });
    */
});
connection.onCompletionResolve(function (item) {
    // If you need to further customize the completion item, you can do it here.
    return item;
});
documents.listen(connection);
connection.listen();

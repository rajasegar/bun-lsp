#!/usr/bin/env node

import {
  createConnection,
  TextDocuments,
  CompletionItemKind,
  TextDocumentSyncKind,
  DidChangeConfigurationNotification,
  MarkupKind,
  SignatureHelp,
  TextDocumentPositionParams,
} from 'vscode-languageserver/node';
import { TextDocument } from "vscode-languageserver-textdocument";


const connection = createConnection(process.stdin, process.stdout);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability: boolean = false;


connection.onInitialize(() => {
  // const capabilities = params.capabilities;

  // Check if the client supports configuration
  // hasConfigurationCapability = capabilities.workspace && !!capabilities.workspace.configuration;

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ["Bun."]
      },
      hoverProvider: true,
    },
  };
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined
    );
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log("Workspace folder change event received.");
    });
  }
});


connection.onCompletion((_textDocumentPosition) => {
  // For simplicity, this example returns the same completion items for all positions.
  return [
    {
      label: 'serve',
      kind: CompletionItemKind.Method,
      data: 1,
      documentation: {
        kind: MarkupKind.Markdown,
        value: "Start an HTTP server"
      }
    },
    {
      label: 'file',
      kind: CompletionItemKind.Method,
      data: 1,
      documentation: {
        kind: MarkupKind.Markdown,
        value: "Reading files"
      }
    },
{
      label: 'write',
      kind: CompletionItemKind.Method,
      data: 1,
      documentation: {
        kind: MarkupKind.Markdown,
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

function provideSignatureHelp(params: TextDocumentPositionParams): SignatureHelp | null {
    // Implement your logic here to compute signature help information based on the params.
    // You might parse the document, determine the function being called, and fetch signature details.

    const signature: SignatureHelp = {
        signatures: [
            {
                label: 'Bun.file(path)',
                documentation: 'This is the documentation for the function.',
                parameters: [
                    {
                        label: 'path',
                        documentation: 'Description of path',
                    },
/*
                    {
                        label: 'param2',
                        documentation: 'Description of param2',
                    },
                    */
                ],
            },
        ],
        activeSignature: 0,
        activeParameter: 0, // Set this to the currently selected parameter if applicable.
    };

    return signature;
}

connection.onSignatureHelp((params: TextDocumentPositionParams): SignatureHelp | null => {
    // Call your signature help provider function
    return provideSignatureHelp(params);
});


connection.onCompletionResolve((item) => {
  // If you need to further customize the completion item, you can do it here.
  return item;
});

documents.listen(connection);
connection.listen();




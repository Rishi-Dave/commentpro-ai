
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { execFile } = require('child_process');
const path = require('path');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('commentpro-ai.generateDoc', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const code = editor.document.getText(editor.selection);

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating Documentation...",
                cancellable: false
            }, async () => {
                try {
                    const pythonPath = 'python'; // Ensure 'python' is in your PATH or provide the full path to the Python executable
                    const scriptPath = path.join(__dirname, '../python/generate_doc.py');

                    const process = execFile(pythonPath, [scriptPath], (error, stdout, stderr) => {
                        if (error) {
                            vscode.window.showErrorMessage(`Failed to generate documentation: ${stderr}`);
                            console.error(`Error: ${stderr}`);
                            return;
                        }
                        vscode.window.showInformationMessage('Documentation generated successfully');
                        editor.edit(editBuilder => {
                            editBuilder.insert(editor.selection.end, `\n\n${stdout}`);
                        });
                    });

                    // Send the selected code to the Python script
                    process.stdin.write(code);
                    process.stdin.end();

                } catch (error) {
                    vscode.window.showErrorMessage('Failed to generate documentation');
                    console.error('Error:', error);
                }
            });
        } else {
            vscode.window.showErrorMessage('No code selected');
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

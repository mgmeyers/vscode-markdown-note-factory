import * as vscode from 'vscode'
import { newNote } from './commands/newNote'
import { newNoteFromSelection } from './commands/newNoteFromSelection'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'markdown-note-factory.newNote',
            newNote
        )
    )

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'markdown-note-factory.newNoteFromSelection',
            newNoteFromSelection
        )
    )
}

export function deactivate() {}

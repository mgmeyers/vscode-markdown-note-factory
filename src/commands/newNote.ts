import * as vscode from 'vscode'

import { createNote, openNoteByFilePath, promptForNoteTitle } from './helpers'

export function newNote() {
    promptForNoteTitle().then(
        (title) => {
            if (!title || !title.trim()) {
                return
            }

            const { absoluteFilePath } = createNote(title)

            openNoteByFilePath(absoluteFilePath).then((editor) => {
                const lineNumber = editor.document.lineCount
                const range = editor.document.lineAt(lineNumber - 1).range

                editor.selection = new vscode.Selection(range.end, range.end)
                editor.revealRange(range)
            })
        },
        () => {
            vscode.window.showErrorMessage('Error creating note')
        }
    )
}

import * as vscode from 'vscode'

import { createNote, openNoteByFilePath, promptForNoteTitle } from './helpers'
import { getConfig, NoteDestination } from '../config'


export function newNote() {
    promptForNoteTitle().then(
        (title) => {
            if (!title || !title.trim()) {
                return
            }

            const { absoluteFilePath } = createNote(title)

            const newNoteDestination = getConfig().newNoteTab

            if (newNoteDestination === NoteDestination.none) {
                return
            }

            const shouldOpenInBackground = newNoteDestination === NoteDestination.background
            const sourceURI = vscode.window.activeTextEditor?.document.uri

            openNoteByFilePath({ filepath: absoluteFilePath, shouldOpenInBackground }).then((editor) => {
                const lineNumber = editor.document.lineCount
                const range = editor.document.lineAt(lineNumber - 1).range

                editor.selection = new vscode.Selection(range.end, range.end)
                editor.revealRange(range)

                if (shouldOpenInBackground && sourceURI) {
                    vscode.window.showTextDocument(sourceURI)
                }
            })
        },
        () => {
            vscode.window.showErrorMessage('Error creating note')
        }
    )
}

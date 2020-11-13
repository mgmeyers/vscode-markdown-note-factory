import { format } from 'date-fns'
import * as vscode from 'vscode'
import { getConfig, NoteDestination } from '../config'

import {
    createNote,
    fillTemplate,
    getPathBetween,
    openNoteByFilePath,
    promptForNoteTitle,
} from './helpers'

export function newNoteFromSelection() {
    const config = getConfig()
    const originEditor = vscode.window.activeTextEditor

    if (!originEditor) {
        return
    }

    const { selection } = originEditor
    const noteContents = originEditor.document.getText(selection)
    const originSelectionRange = new vscode.Range(
        selection.start,
        selection.end
    )

    if (noteContents === '') {
        vscode.window.showErrorMessage(
            'Error creating note from selection: selection is empty.'
        )
        return
    }

    promptForNoteTitle().then(
        (title) => {
            if (!title || !title.trim()) {
                return
            }

            const {
                absoluteFilePath,
                fileAlreadyExists,
                ...fileData
            } = createNote(title, noteContents)

            const replacement = fillTemplate(
                config.selectionReplacementTemplate,
                {
                    timestamp: new Date().toISOString(),
                    date: format(new Date(), config.dateFormat),
                    absoluteFilePath,
                    relativeDirectoryPath: getPathBetween(
                        originEditor.document.uri.fsPath,
                        absoluteFilePath
                    ),
                    ...fileData,
                }
            )

            originEditor.edit((edit) => {
                edit.replace(originSelectionRange, replacement)
            })

            const newNoteDestination = getConfig().newNoteFromSelectionTab

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

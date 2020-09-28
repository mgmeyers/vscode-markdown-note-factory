import * as vscode from 'vscode'
import { getConfig } from '../config'

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

            openNoteByFilePath(absoluteFilePath).then(() => {
                const editor = vscode.window.activeTextEditor

                if (!editor) {
                    return
                }

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

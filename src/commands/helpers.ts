import * as vscode from 'vscode'
import { dirname, isAbsolute, join, relative, sep } from 'path'
import { existsSync, writeFileSync } from 'fs'
import GithubSlugger from 'github-slugger'
import sanitizeFileName from 'sanitize-filename'
import { FileNameFormat, getConfig, NoteDirectory } from '../config'

export const fileExtensionRe = /\.(md|markdown|mdx|fountain)$/i

export function normalizeDirectoryPath(path: string) {
    if (path === '') {
        return path
    }

    if (!path.endsWith(sep)) {
        return path + sep
    }
}

export function getPathBetween(
    originFilePath: string,
    destinationFilePath: string
) {
    return normalizeDirectoryPath(
        relative(dirname(originFilePath), dirname(destinationFilePath))
    )
}

export function promptForNoteTitle() {
    return vscode.window.showInputBox({
        prompt: 'Enter note title',
        value: '',
    })
}

export function withExtension(fileName: string) {
    const config = getConfig()

    return fileExtensionRe.test(fileName)
        ? fileName
        : `${fileName}.${config.defaultFileExtension}`
}

export function convertTitleToFileName(noteTitle: string) {
    const config = getConfig()

    switch (config.fileNameFormat) {
        case FileNameFormat.slugged:
            return new GithubSlugger().slug(noteTitle.trim(), true)
        case FileNameFormat.lowercaseSlugged:
            return new GithubSlugger().slug(noteTitle.trim())
        case FileNameFormat.asIs:
            return sanitizeFileName(noteTitle.trim())
    }
}

export function fillTemplate(
    template: string,
    values: { [k: string]: string | undefined }
) {
    return template.replace(/(\$\{)(.+)(\})/g, (match, _, token) => {
        const value = values[token]

        if (value) {
            return value
        }

        return ''
    })
}

export function createNote(noteTitle: string, noteContent?: string) {
    const config = getConfig()

    let workspacePath = ''

    if (vscode.workspace.workspaceFolders) {
        workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()
    }

    const activeFile = vscode.window.activeTextEditor?.document
    const activePath = activeFile ? dirname(activeFile.uri.fsPath) : null

    let noteDirectory = config.newNoteDirectory

    if (noteDirectory == NoteDirectory.sameAsActiveNote) {
        if (activePath) {
            noteDirectory = activePath
        } else {
            vscode.window.showWarningMessage(
                `Error: newNoteDirectory was ${NoteDirectory.sameAsActiveNote} but no active note; using ${NoteDirectory.workspaceRoot}`
            )
            noteDirectory = NoteDirectory.workspaceRoot
        }
    }

    if (noteDirectory != NoteDirectory.workspaceRoot) {
        if (!isAbsolute(noteDirectory)) {
            noteDirectory = join(workspacePath, noteDirectory)
        }

        const dirExists = existsSync(noteDirectory)

        if (!dirExists) {
            vscode.window.showWarningMessage(
                `Error creating note: directory \`${noteDirectory}\` does not exist. Using ${NoteDirectory.workspaceRoot}.`
            )
            noteDirectory = NoteDirectory.workspaceRoot
        }
    }

    if (noteDirectory == NoteDirectory.workspaceRoot) {
        noteDirectory = workspacePath
    }

    const fileName = convertTitleToFileName(noteTitle)
    const fileNameWithExtension = withExtension(fileName)
    const fileWorkspaceDirectory = normalizeDirectoryPath(
        relative(workspacePath, noteDirectory)
    )

    const absoluteFilePath = join(noteDirectory, fileNameWithExtension)
    const fileAlreadyExists = existsSync(absoluteFilePath)

    if (fileAlreadyExists) {
        vscode.window.showWarningMessage(
            `Error: note at path already exists: ${absoluteFilePath}`
        )
    } else {
        const fileContent = fillTemplate(config.noteTemplate, {
            noteTitle,
            noteContent,
            timestamp: new Date().toISOString(),
            date: (new Date().toISOString().match(/(\d{4}-\d{2}-\d{2})/) ||
                '')[0],
        })
        writeFileSync(absoluteFilePath, fileContent)
    }

    return {
        absoluteFileDirectory: noteDirectory,
        absoluteFilePath,
        fileAlreadyExists,
        fileExtension: config.defaultFileExtension,
        fileName,
        fileNameWithExtension,
        fileWorkspaceDirectory,
    }
}

export function openNoteByFilePath(filepath: string) {
    return vscode.window.showTextDocument(vscode.Uri.file(filepath), {
        preserveFocus: false,
        preview: false,
    })
}

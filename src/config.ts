import * as vscode from 'vscode'

export enum FileNameFormat {
    slugged = 'slugged',
    lowercaseSlugged = 'lowercase-slugged',
    asIs = 'as-is',
}

export enum NoteDirectory {
    sameAsActiveNote = 'SAME_AS_ACTIVE_NOTE',
    workspaceRoot = 'WORKSPACE_ROOT',
}

export interface Config {
    defaultFileExtension: string
    fileNameFormat: FileNameFormat
    newNoteDirectory: NoteDirectory | string
    noteTemplate: string
    selectionReplacementTemplate: string
}

export function getConfig(): Config {
    const config = vscode.workspace.getConfiguration('markdown-note-factory')

    return {
        defaultFileExtension: config.get('defaultFileExtension') || 'md',
        fileNameFormat:
            config.get('fileNameFormat') || FileNameFormat.lowercaseSlugged,
        newNoteDirectory:
            config.get('newNoteDirectory') || NoteDirectory.sameAsActiveNote,
        noteTemplate:
            config.get('noteTemplate') || '# ${noteTitle}\n\n${noteContent}',
        selectionReplacementTemplate:
            config.get('selectionReplacementTemplate') || '[[${fileName}]]',
    }
}

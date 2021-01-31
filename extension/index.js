'use strict';

var vscode = require('vscode');
var prettydiff = require('prettydiff');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var vscode__default = /*#__PURE__*/_interopDefaultLegacy(vscode);
var prettydiff__default = /*#__PURE__*/_interopDefaultLegacy(prettydiff);

// import snippetsArr from './hover/filters.json'
// import functionsArr from './hover/functions.json'
// import twigArr from './hover/twig.json'

const editor = vscode__default['default'].workspace.getConfiguration('editor');
const config = vscode__default['default'].workspace.getConfiguration('twig-language');

// function createHover(snippet, type) {
//     const example =
//         typeof snippet.example == 'undefined' ? '' : snippet.example
//     const description =
//         typeof snippet.description == 'undefined' ? '' : snippet.description
//     return new vscode.Hover({
//         language: type,
//         value: description + '\n\n' + example
//     })
// }

function prettyDiff(document, range) {
    const result = [];
    let output = "";
    let options = prettydiff__default['default'].options;

    let tabSize = editor.tabSize;
    let indentChar = " ";

    if (config.tabSize > 0) {
        tabSize = config.tabSize;
    }

    if (config.indentStyle == "tab") {
        tabSize = 0;
        indentChar = "\t";
    }

    options.source = document.getText(range);
    options.mode = 'beautify';
    options.language = 'html';
    options.lexer = 'markup';
    options.brace_line = config.braceLine;
    options.brace_padding = config.bracePadding;
    options.brace_style = config.braceStyle;
    options.braces = config.braces;
    options.comment_line = config.commentLine;
    options.comments = config.comments;
    options.compressed_css = config.compressedCss;
    options.correct = config.correct;
    options.cssInsertLines = config.cssInsertLines;
    options.else_line = config.elseLine;
    options.end_comma = config.endComma;
    options.force_attribute = config.forceAttribute;
    options.force_indent = config.forceIndent;
    options.format_array = config.formatArray;
    options.format_object = config.formatObject;
    options.function_name = config.functionName;
    options.indent_level = config.indentLevel;
    options.indent_char = indentChar;
    options.indent_size = tabSize;
    options.method_chain = config.methodChain;
    options.never_flatten = config.neverFlatten;
    options.new_line = config.newLine;
    options.no_case_indent = config.noCaseIndent;
    options.no_lead_zero = config.noLeadZero;
    options.object_sort = config.objectSort;
    options.preserve = config.preserve;
    options.preserve_comment = config.preserveComment;
    options.quote_convert = config.quoteConvert;
    options.space = config.space;
    options.space_close = config.spaceSlose;
    options.tag_merge = config.tagMerge;
    options.tag_sort = config.tagSort;
    options.ternary_line = config.ternaryLine;
    options.unformatted = config.unformatted;
    options.variable_list = config.variableList;
    options.vertical = config.vertical;
    options.wrap = config.wrap;

    output = prettydiff__default['default']();

    options.end = 0;
    options.start = 0;

    result.push(vscode__default['default'].TextEdit.replace(range, output));
    return result;
}
function activate(context) {
    const active = vscode__default['default'].window.activeTextEditor;
    if (!active || !active.document) return

    registerDocType('html');

    function registerDocType(type) {
        // if (config.hover === true) {
        //     context.subscriptions.push(
        //         vscode.languages.registerHoverProvider(type, {
        //             provideHover(document, position) {
        //                 const range = document.getWordRangeAtPosition(position)
        //                 const word = document.getText(range)

        //                 for (const snippet in snippetsArr) {
        //                     if (
        //                         snippetsArr[snippet].prefix == word ||
        //                         snippetsArr[snippet].hover == word
        //                     ) {
        //                         return createHover(snippetsArr[snippet], type)
        //                     }
        //                 }

        //                 for (const snippet in functionsArr) {
        //                     if (
        //                         functionsArr[snippet].prefix == word ||
        //                         functionsArr[snippet].hover == word
        //                     ) {
        //                         return createHover(functionsArr[snippet], type)
        //                     }
        //                 }

        //                 for (const snippet in twigArr) {
        //                     if (
        //                         twigArr[snippet].prefix == word ||
        //                         twigArr[snippet].hover == word
        //                     ) {
        //                         return createHover(twigArr[snippet], type)
        //                     }
        //                 }
        //             }
        //         })
        //     )
        // }

        if (config.formatting === true) {
            context.subscriptions.push(
                vscode__default['default'].languages.registerDocumentFormattingEditProvider(type, {
                    provideDocumentFormattingEdits: function (
                        document
                    ) {
                        const start = new vscode__default['default'].Position(0, 0);
                        const end = new vscode__default['default'].Position(
                            document.lineCount - 1,
                            document.lineAt(document.lineCount - 1).text.length
                        );
                        const rng = new vscode__default['default'].Range(start, end);
                        return prettyDiff(document, rng);
                    }
                })
            );

            context.subscriptions.push(
                vscode__default['default'].languages.registerDocumentRangeFormattingEditProvider(
                    type,
                    {
                        provideDocumentRangeFormattingEdits: function (
                            document,
                            range
                        ) {
                            let end = range.end;

                            if (end.character === 0) {
                                end = end.translate(-1, Number.MAX_VALUE);
                            } else {
                                end = end.translate(0, Number.MAX_VALUE);
                            }

                            const rng = new vscode__default['default'].Range(new vscode__default['default'].Position(range.start.line, 0), end);
                            return prettyDiff(document, rng);
                        }
                    }
                )
            );
        }
    }
}

exports.activate = activate;

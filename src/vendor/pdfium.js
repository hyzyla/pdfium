var PDFiumModule = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return function (moduleArg = {}) {
    var Module = moduleArg;
    var readyPromiseResolve, readyPromiseReject;
    Module['ready'] = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    [
      '_FPDFAnnot_IsSupportedSubtype',
      '_FPDFPage_CreateAnnot',
      '_FPDFPage_GetAnnotCount',
      '_FPDFPage_GetAnnot',
      '_FPDFPage_GetAnnotIndex',
      '_FPDFPage_CloseAnnot',
      '_FPDFPage_RemoveAnnot',
      '_FPDFAnnot_GetSubtype',
      '_FPDFAnnot_IsObjectSupportedSubtype',
      '_FPDFAnnot_UpdateObject',
      '_FPDFAnnot_AddInkStroke',
      '_FPDFAnnot_RemoveInkList',
      '_FPDFAnnot_AppendObject',
      '_FPDFAnnot_GetObjectCount',
      '_FPDFAnnot_GetObject',
      '_FPDFAnnot_RemoveObject',
      '_FPDFAnnot_SetColor',
      '_FPDFAnnot_GetColor',
      '_FPDFAnnot_HasAttachmentPoints',
      '_FPDFAnnot_SetAttachmentPoints',
      '_FPDFAnnot_AppendAttachmentPoints',
      '_FPDFAnnot_CountAttachmentPoints',
      '_FPDFAnnot_GetAttachmentPoints',
      '_FPDFAnnot_SetRect',
      '_FPDFAnnot_GetRect',
      '_FPDFAnnot_GetVertices',
      '_FPDFAnnot_GetInkListCount',
      '_FPDFAnnot_GetInkListPath',
      '_FPDFAnnot_GetLine',
      '_FPDFAnnot_SetBorder',
      '_FPDFAnnot_GetBorder',
      '_FPDFAnnot_GetFormAdditionalActionJavaScript',
      '_FPDFAnnot_HasKey',
      '_FPDFAnnot_GetValueType',
      '_FPDFAnnot_SetStringValue',
      '_FPDFAnnot_GetStringValue',
      '_FPDFAnnot_GetNumberValue',
      '_FPDFAnnot_SetAP',
      '_FPDFAnnot_GetAP',
      '_FPDFAnnot_GetLinkedAnnot',
      '_FPDFAnnot_GetFlags',
      '_FPDFAnnot_SetFlags',
      '_FPDFAnnot_GetFormFieldFlags',
      '_FPDFAnnot_GetFormFieldAtPoint',
      '_FPDFAnnot_GetFormFieldName',
      '_FPDFAnnot_GetFormFieldAlternateName',
      '_FPDFAnnot_GetFormFieldType',
      '_FPDFAnnot_GetFormFieldValue',
      '_FPDFAnnot_GetOptionCount',
      '_FPDFAnnot_GetOptionLabel',
      '_FPDFAnnot_IsOptionSelected',
      '_FPDFAnnot_GetFontSize',
      '_FPDFAnnot_IsChecked',
      '_FPDFAnnot_SetFocusableSubtypes',
      '_FPDFAnnot_GetFocusableSubtypesCount',
      '_FPDFAnnot_GetFocusableSubtypes',
      '_FPDFAnnot_GetLink',
      '_FPDFAnnot_GetFormControlCount',
      '_FPDFAnnot_GetFormControlIndex',
      '_FPDFAnnot_GetFormFieldExportValue',
      '_FPDFAnnot_SetURI',
      '_FPDFDoc_GetAttachmentCount',
      '_FPDFDoc_AddAttachment',
      '_FPDFDoc_GetAttachment',
      '_FPDFDoc_DeleteAttachment',
      '_FPDFAttachment_GetName',
      '_FPDFAttachment_HasKey',
      '_FPDFAttachment_GetValueType',
      '_FPDFAttachment_SetStringValue',
      '_FPDFAttachment_GetStringValue',
      '_FPDFAttachment_SetFile',
      '_FPDFAttachment_GetFile',
      '_FPDFCatalog_IsTagged',
      '_FPDFAvail_Create',
      '_FPDFAvail_Destroy',
      '_FPDFAvail_IsDocAvail',
      '_FPDFAvail_GetDocument',
      '_FPDFAvail_GetFirstPageNum',
      '_FPDFAvail_IsPageAvail',
      '_FPDFAvail_IsFormAvail',
      '_FPDFAvail_IsLinearized',
      '_FPDFBookmark_GetFirstChild',
      '_FPDFBookmark_GetNextSibling',
      '_FPDFBookmark_GetTitle',
      '_FPDFBookmark_GetCount',
      '_FPDFBookmark_Find',
      '_FPDFBookmark_GetDest',
      '_FPDFBookmark_GetAction',
      '_FPDFAction_GetType',
      '_FPDFAction_GetDest',
      '_FPDFAction_GetFilePath',
      '_FPDFAction_GetURIPath',
      '_FPDFDest_GetDestPageIndex',
      '_FPDFDest_GetView',
      '_FPDFDest_GetLocationInPage',
      '_FPDFLink_GetLinkAtPoint',
      '_FPDFLink_GetLinkZOrderAtPoint',
      '_FPDFLink_GetDest',
      '_FPDFLink_GetAction',
      '_FPDFLink_Enumerate',
      '_FPDFLink_GetAnnot',
      '_FPDFLink_GetAnnotRect',
      '_FPDFLink_CountQuadPoints',
      '_FPDFLink_GetQuadPoints',
      '_FPDF_GetPageAAction',
      '_FPDF_GetFileIdentifier',
      '_FPDF_GetMetaText',
      '_FPDF_GetPageLabel',
      '_FPDF_CreateNewDocument',
      '_FPDFPage_New',
      '_FPDFPage_Delete',
      '_FPDF_MovePages',
      '_FPDFPage_GetRotation',
      '_FPDFPage_SetRotation',
      '_FPDFPage_InsertObject',
      '_FPDFPage_RemoveObject',
      '_FPDFPage_CountObjects',
      '_FPDFPage_GetObject',
      '_FPDFPage_HasTransparency',
      '_FPDFPage_GenerateContent',
      '_FPDFPageObj_Destroy',
      '_FPDFPageObj_HasTransparency',
      '_FPDFPageObj_GetType',
      '_FPDFPageObj_Transform',
      '_FPDFPageObj_GetMatrix',
      '_FPDFPageObj_SetMatrix',
      '_FPDFPage_TransformAnnots',
      '_FPDFPageObj_NewImageObj',
      '_FPDFPageObj_CountMarks',
      '_FPDFPageObj_GetMark',
      '_FPDFPageObj_AddMark',
      '_FPDFPageObj_RemoveMark',
      '_FPDFPageObjMark_GetName',
      '_FPDFPageObjMark_CountParams',
      '_FPDFPageObjMark_GetParamKey',
      '_FPDFPageObjMark_GetParamValueType',
      '_FPDFPageObjMark_GetParamIntValue',
      '_FPDFPageObjMark_GetParamStringValue',
      '_FPDFPageObjMark_GetParamBlobValue',
      '_FPDFPageObjMark_SetIntParam',
      '_FPDFPageObjMark_SetStringParam',
      '_FPDFPageObjMark_SetBlobParam',
      '_FPDFPageObjMark_RemoveParam',
      '_FPDFImageObj_LoadJpegFile',
      '_FPDFImageObj_LoadJpegFileInline',
      '_FPDFImageObj_SetMatrix',
      '_FPDFImageObj_SetBitmap',
      '_FPDFImageObj_GetBitmap',
      '_FPDFImageObj_GetRenderedBitmap',
      '_FPDFImageObj_GetImageDataDecoded',
      '_FPDFImageObj_GetImageDataRaw',
      '_FPDFImageObj_GetImageFilterCount',
      '_FPDFImageObj_GetImageFilter',
      '_FPDFImageObj_GetImageMetadata',
      '_FPDFImageObj_GetImagePixelSize',
      '_FPDFPageObj_CreateNewPath',
      '_FPDFPageObj_CreateNewRect',
      '_FPDFPageObj_GetBounds',
      '_FPDFPageObj_GetRotatedBounds',
      '_FPDFPageObj_SetBlendMode',
      '_FPDFPageObj_SetStrokeColor',
      '_FPDFPageObj_GetStrokeColor',
      '_FPDFPageObj_SetStrokeWidth',
      '_FPDFPageObj_GetStrokeWidth',
      '_FPDFPageObj_GetLineJoin',
      '_FPDFPageObj_SetLineJoin',
      '_FPDFPageObj_GetLineCap',
      '_FPDFPageObj_SetLineCap',
      '_FPDFPageObj_SetFillColor',
      '_FPDFPageObj_GetFillColor',
      '_FPDFPageObj_GetDashPhase',
      '_FPDFPageObj_SetDashPhase',
      '_FPDFPageObj_GetDashCount',
      '_FPDFPageObj_GetDashArray',
      '_FPDFPageObj_SetDashArray',
      '_FPDFPath_CountSegments',
      '_FPDFPath_GetPathSegment',
      '_FPDFPathSegment_GetPoint',
      '_FPDFPathSegment_GetType',
      '_FPDFPathSegment_GetClose',
      '_FPDFPath_MoveTo',
      '_FPDFPath_LineTo',
      '_FPDFPath_BezierTo',
      '_FPDFPath_Close',
      '_FPDFPath_SetDrawMode',
      '_FPDFPath_GetDrawMode',
      '_FPDFPageObj_NewTextObj',
      '_FPDFText_SetText',
      '_FPDFText_SetCharcodes',
      '_FPDFText_LoadFont',
      '_FPDFText_LoadStandardFont',
      '_FPDFTextObj_GetFontSize',
      '_FPDFFont_Close',
      '_FPDFPageObj_CreateTextObj',
      '_FPDFTextObj_GetTextRenderMode',
      '_FPDFTextObj_SetTextRenderMode',
      '_FPDFTextObj_GetText',
      '_FPDFTextObj_GetRenderedBitmap',
      '_FPDFTextObj_GetFont',
      '_FPDFFont_GetFontName',
      '_FPDFFont_GetFontData',
      '_FPDFFont_GetIsEmbedded',
      '_FPDFFont_GetFlags',
      '_FPDFFont_GetWeight',
      '_FPDFFont_GetItalicAngle',
      '_FPDFFont_GetAscent',
      '_FPDFFont_GetDescent',
      '_FPDFFont_GetGlyphWidth',
      '_FPDFFont_GetGlyphPath',
      '_FPDFGlyphPath_CountGlyphSegments',
      '_FPDFGlyphPath_GetGlyphPathSegment',
      '_FPDFFormObj_CountObjects',
      '_FPDFFormObj_GetObject',
      '_FSDK_SetUnSpObjProcessHandler',
      '_FSDK_SetTimeFunction',
      '_FSDK_SetLocaltimeFunction',
      '_FPDFDoc_GetPageMode',
      '_FPDFPage_Flatten',
      '_FPDFDOC_InitFormFillEnvironment',
      '_FPDFDOC_ExitFormFillEnvironment',
      '_FORM_OnAfterLoadPage',
      '_FORM_OnBeforeClosePage',
      '_FORM_DoDocumentJSAction',
      '_FORM_DoDocumentOpenAction',
      '_FORM_DoDocumentAAction',
      '_FORM_DoPageAAction',
      '_FORM_OnMouseMove',
      '_FORM_OnMouseWheel',
      '_FORM_OnFocus',
      '_FORM_OnLButtonDown',
      '_FORM_OnRButtonDown',
      '_FORM_OnLButtonUp',
      '_FORM_OnRButtonUp',
      '_FORM_OnLButtonDoubleClick',
      '_FORM_OnKeyDown',
      '_FORM_OnKeyUp',
      '_FORM_OnChar',
      '_FORM_GetFocusedText',
      '_FORM_GetSelectedText',
      '_FORM_ReplaceAndKeepSelection',
      '_FORM_ReplaceSelection',
      '_FORM_SelectAllText',
      '_FORM_CanUndo',
      '_FORM_CanRedo',
      '_FORM_Undo',
      '_FORM_Redo',
      '_FORM_ForceToKillFocus',
      '_FORM_GetFocusedAnnot',
      '_FORM_SetFocusedAnnot',
      '_FPDFPage_HasFormFieldAtPoint',
      '_FPDFPage_FormFieldZOrderAtPoint',
      '_FPDF_SetFormFieldHighlightColor',
      '_FPDF_SetFormFieldHighlightAlpha',
      '_FPDF_RemoveFormFieldHighlight',
      '_FPDF_FFLDraw',
      '_FPDF_GetFormType',
      '_FORM_SetIndexSelected',
      '_FORM_IsIndexSelected',
      '_FPDF_LoadXFA',
      '_FPDFDoc_GetJavaScriptActionCount',
      '_FPDFDoc_GetJavaScriptAction',
      '_FPDFDoc_CloseJavaScriptAction',
      '_FPDFJavaScriptAction_GetName',
      '_FPDFJavaScriptAction_GetScript',
      '_FPDF_ImportPagesByIndex',
      '_FPDF_ImportPages',
      '_FPDF_ImportNPagesToOne',
      '_FPDF_NewXObjectFromPage',
      '_FPDF_CloseXObject',
      '_FPDF_NewFormObjectFromXObject',
      '_FPDF_CopyViewerPreferences',
      '_FPDF_RenderPageBitmapWithColorScheme_Start',
      '_FPDF_RenderPageBitmap_Start',
      '_FPDF_RenderPage_Continue',
      '_FPDF_RenderPage_Close',
      '_FPDF_SaveAsCopy',
      '_FPDF_SaveWithVersion',
      '_FPDFText_GetCharIndexFromTextIndex',
      '_FPDFText_GetTextIndexFromCharIndex',
      '_FPDF_GetSignatureCount',
      '_FPDF_GetSignatureObject',
      '_FPDFSignatureObj_GetContents',
      '_FPDFSignatureObj_GetByteRange',
      '_FPDFSignatureObj_GetSubFilter',
      '_FPDFSignatureObj_GetReason',
      '_FPDFSignatureObj_GetTime',
      '_FPDFSignatureObj_GetDocMDPPermission',
      '_FPDF_StructTree_GetForPage',
      '_FPDF_StructTree_Close',
      '_FPDF_StructTree_CountChildren',
      '_FPDF_StructTree_GetChildAtIndex',
      '_FPDF_StructElement_GetAltText',
      '_FPDF_StructElement_GetActualText',
      '_FPDF_StructElement_GetID',
      '_FPDF_StructElement_GetLang',
      '_FPDF_StructElement_GetStringAttribute',
      '_FPDF_StructElement_GetMarkedContentID',
      '_FPDF_StructElement_GetType',
      '_FPDF_StructElement_GetObjType',
      '_FPDF_StructElement_GetTitle',
      '_FPDF_StructElement_CountChildren',
      '_FPDF_StructElement_GetChildAtIndex',
      '_FPDF_StructElement_GetChildMarkedContentID',
      '_FPDF_StructElement_GetParent',
      '_FPDF_StructElement_GetAttributeCount',
      '_FPDF_StructElement_GetAttributeAtIndex',
      '_FPDF_StructElement_Attr_GetCount',
      '_FPDF_StructElement_Attr_GetName',
      '_FPDF_StructElement_Attr_GetType',
      '_FPDF_StructElement_Attr_GetBooleanValue',
      '_FPDF_StructElement_Attr_GetNumberValue',
      '_FPDF_StructElement_Attr_GetStringValue',
      '_FPDF_StructElement_Attr_GetBlobValue',
      '_FPDF_StructElement_GetMarkedContentIdCount',
      '_FPDF_StructElement_GetMarkedContentIdAtIndex',
      '_FPDF_GetDefaultTTFMap',
      '_FPDF_AddInstalledFont',
      '_FPDF_SetSystemFontInfo',
      '_FPDF_GetDefaultSystemFontInfo',
      '_FPDF_FreeDefaultSystemFontInfo',
      '_FPDFText_LoadPage',
      '_FPDFText_ClosePage',
      '_FPDFText_CountChars',
      '_FPDFText_GetUnicode',
      '_FPDFText_IsGenerated',
      '_FPDFText_IsHyphen',
      '_FPDFText_HasUnicodeMapError',
      '_FPDFText_GetFontSize',
      '_FPDFText_GetFontInfo',
      '_FPDFText_GetFontWeight',
      '_FPDFText_GetTextRenderMode',
      '_FPDFText_GetFillColor',
      '_FPDFText_GetStrokeColor',
      '_FPDFText_GetCharAngle',
      '_FPDFText_GetCharBox',
      '_FPDFText_GetLooseCharBox',
      '_FPDFText_GetMatrix',
      '_FPDFText_GetCharOrigin',
      '_FPDFText_GetCharIndexAtPos',
      '_FPDFText_GetText',
      '_FPDFText_CountRects',
      '_FPDFText_GetRect',
      '_FPDFText_GetBoundedText',
      '_FPDFText_FindStart',
      '_FPDFText_FindNext',
      '_FPDFText_FindPrev',
      '_FPDFText_GetSchResultIndex',
      '_FPDFText_GetSchCount',
      '_FPDFText_FindClose',
      '_FPDFLink_LoadWebLinks',
      '_FPDFLink_CountWebLinks',
      '_FPDFLink_GetURL',
      '_FPDFLink_CountRects',
      '_FPDFLink_GetRect',
      '_FPDFLink_GetTextRange',
      '_FPDFLink_CloseWebLinks',
      '_FPDFPage_GetDecodedThumbnailData',
      '_FPDFPage_GetRawThumbnailData',
      '_FPDFPage_GetThumbnailAsBitmap',
      '_FPDFPage_SetMediaBox',
      '_FPDFPage_SetCropBox',
      '_FPDFPage_SetBleedBox',
      '_FPDFPage_SetTrimBox',
      '_FPDFPage_SetArtBox',
      '_FPDFPage_GetMediaBox',
      '_FPDFPage_GetCropBox',
      '_FPDFPage_GetBleedBox',
      '_FPDFPage_GetTrimBox',
      '_FPDFPage_GetArtBox',
      '_FPDFPage_TransFormWithClip',
      '_FPDFPageObj_TransformClipPath',
      '_FPDFPageObj_GetClipPath',
      '_FPDFClipPath_CountPaths',
      '_FPDFClipPath_CountPathSegments',
      '_FPDFClipPath_GetPathSegment',
      '_FPDF_CreateClipPath',
      '_FPDF_DestroyClipPath',
      '_FPDFPage_InsertClipPath',
      '_FPDF_InitLibraryWithConfig',
      '_FPDF_InitLibrary',
      '_FPDF_DestroyLibrary',
      '_FPDF_SetSandBoxPolicy',
      '_FPDF_LoadDocument',
      '_FPDF_LoadMemDocument',
      '_FPDF_LoadMemDocument64',
      '_FPDF_LoadCustomDocument',
      '_FPDF_GetFileVersion',
      '_FPDF_GetLastError',
      '_FPDF_DocumentHasValidCrossReferenceTable',
      '_FPDF_GetTrailerEnds',
      '_FPDF_GetDocPermissions',
      '_FPDF_GetDocUserPermissions',
      '_FPDF_GetSecurityHandlerRevision',
      '_FPDF_GetPageCount',
      '_FPDF_LoadPage',
      '_FPDF_GetPageWidthF',
      '_FPDF_GetPageWidth',
      '_FPDF_GetPageHeightF',
      '_FPDF_GetPageHeight',
      '_FPDF_GetPageBoundingBox',
      '_FPDF_GetPageSizeByIndexF',
      '_FPDF_GetPageSizeByIndex',
      '_FPDF_RenderPageBitmap',
      '_FPDF_RenderPageBitmapWithMatrix',
      '_FPDF_ClosePage',
      '_FPDF_CloseDocument',
      '_FPDF_DeviceToPage',
      '_FPDF_PageToDevice',
      '_FPDFBitmap_Create',
      '_FPDFBitmap_CreateEx',
      '_FPDFBitmap_GetFormat',
      '_FPDFBitmap_FillRect',
      '_FPDFBitmap_GetBuffer',
      '_FPDFBitmap_GetWidth',
      '_FPDFBitmap_GetHeight',
      '_FPDFBitmap_GetStride',
      '_FPDFBitmap_Destroy',
      '_FPDF_VIEWERREF_GetPrintScaling',
      '_FPDF_VIEWERREF_GetNumCopies',
      '_FPDF_VIEWERREF_GetPrintPageRange',
      '_FPDF_VIEWERREF_GetPrintPageRangeCount',
      '_FPDF_VIEWERREF_GetPrintPageRangeElement',
      '_FPDF_VIEWERREF_GetDuplex',
      '_FPDF_VIEWERREF_GetName',
      '_FPDF_CountNamedDests',
      '_FPDF_GetNamedDestByName',
      '_FPDF_GetNamedDest',
      '_FPDF_GetXFAPacketCount',
      '_FPDF_GetXFAPacketName',
      '_FPDF_GetXFAPacketContent',
      '_memory',
      '_PDFium_Init',
      '___indirect_function_table',
      '_fflush',
      'onRuntimeInitialized',
    ].forEach((prop) => {
      if (!Object.getOwnPropertyDescriptor(Module['ready'], prop)) {
        Object.defineProperty(Module['ready'], prop, {
          get: () =>
            abort(
              'You are getting ' +
                prop +
                ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'
            ),
          set: () =>
            abort(
              'You are setting ' +
                prop +
                ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'
            ),
        });
      }
    });
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = './this.program';
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = typeof window == 'object';
    var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
    var ENVIRONMENT_IS_NODE =
      typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
    var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    if (Module['ENVIRONMENT']) {
      throw new Error(
        'Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)'
      );
    }
    var scriptDirectory = '';
    function locateFile(path) {
      if (Module['locateFile']) {
        return Module['locateFile'](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary;
    if (ENVIRONMENT_IS_NODE) {
      if (typeof process == 'undefined' || !process.release || process.release.name !== 'node')
        throw new Error(
          'not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)'
        );
      var nodeVersion = process.versions.node;
      var numericVersion = nodeVersion.split('.').slice(0, 3);
      numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split('-')[0] * 1;
      if (numericVersion < 16e4) {
        throw new Error('This emscripten-generated code requires node v16.0.0 (detected v' + nodeVersion + ')');
      }
      var fs = require('fs');
      var nodePath = require('path');
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = nodePath.dirname(scriptDirectory) + '/';
      } else {
        scriptDirectory = __dirname + '/';
      }
      read_ = (filename, binary) => {
        filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
        return fs.readFileSync(filename, binary ? undefined : 'utf8');
      };
      readBinary = (filename) => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        assert(ret.buffer);
        return ret;
      };
      readAsync = (filename, onload, onerror, binary = true) => {
        filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
        fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
          if (err) onerror(err);
          else onload(binary ? data.buffer : data);
        });
      };
      if (!Module['thisProgram'] && process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, '/');
      }
      arguments_ = process.argv.slice(2);
      quit_ = (status, toThrow) => {
        process.exitCode = status;
        throw toThrow;
      };
      Module['inspect'] = () => '[Emscripten Module object]';
    } else if (ENVIRONMENT_IS_SHELL) {
      if (
        (typeof process == 'object' && typeof require === 'function') ||
        typeof window == 'object' ||
        typeof importScripts == 'function'
      )
        throw new Error(
          'not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)'
        );
      if (typeof read != 'undefined') {
        read_ = read;
      }
      readBinary = (f) => {
        if (typeof readbuffer == 'function') {
          return new Uint8Array(readbuffer(f));
        }
        let data = read(f, 'binary');
        assert(typeof data == 'object');
        return data;
      };
      readAsync = (f, onload, onerror) => {
        setTimeout(() => onload(readBinary(f)));
      };
      if (typeof clearTimeout == 'undefined') {
        globalThis.clearTimeout = (id) => {};
      }
      if (typeof setTimeout == 'undefined') {
        globalThis.setTimeout = (f) => (typeof f == 'function' ? f() : abort());
      }
      if (typeof scriptArgs != 'undefined') {
        arguments_ = scriptArgs;
      } else if (typeof arguments != 'undefined') {
        arguments_ = arguments;
      }
      if (typeof quit == 'function') {
        quit_ = (status, toThrow) => {
          setTimeout(() => {
            if (!(toThrow instanceof ExitStatus)) {
              let toLog = toThrow;
              if (toThrow && typeof toThrow == 'object' && toThrow.stack) {
                toLog = [toThrow, toThrow.stack];
              }
              err(`exiting due to exception: ${toLog}`);
            }
            quit(status);
          });
          throw toThrow;
        };
      }
      if (typeof print != 'undefined') {
        if (typeof console == 'undefined') console = {};
        console.log = print;
        console.warn = console.error = typeof printErr != 'undefined' ? printErr : print;
      }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != 'undefined' && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf('blob:') !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1);
      } else {
        scriptDirectory = '';
      }
      if (!(typeof window == 'object' || typeof importScripts == 'function'))
        throw new Error(
          'not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)'
        );
      {
        read_ = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.responseType = 'arraybuffer';
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
    } else {
      throw new Error('environment detection error');
    }
    var out = Module['print'] || console.log.bind(console);
    var err = Module['printErr'] || console.error.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    checkIncomingModuleAPI();
    if (Module['arguments']) arguments_ = Module['arguments'];
    legacyModuleProp('arguments', 'arguments_');
    if (Module['thisProgram']) thisProgram = Module['thisProgram'];
    legacyModuleProp('thisProgram', 'thisProgram');
    if (Module['quit']) quit_ = Module['quit'];
    legacyModuleProp('quit', 'quit_');
    assert(
      typeof Module['memoryInitializerPrefixURL'] == 'undefined',
      'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead'
    );
    assert(
      typeof Module['pthreadMainPrefixURL'] == 'undefined',
      'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead'
    );
    assert(
      typeof Module['cdInitializerPrefixURL'] == 'undefined',
      'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead'
    );
    assert(
      typeof Module['filePackagePrefixURL'] == 'undefined',
      'Module.filePackagePrefixURL option was removed, use Module.locateFile instead'
    );
    assert(typeof Module['read'] == 'undefined', 'Module.read option was removed (modify read_ in JS)');
    assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
    assert(
      typeof Module['readBinary'] == 'undefined',
      'Module.readBinary option was removed (modify readBinary in JS)'
    );
    assert(
      typeof Module['setWindowTitle'] == 'undefined',
      'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)'
    );
    assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
    legacyModuleProp('asm', 'wasmExports');
    legacyModuleProp('read', 'read_');
    legacyModuleProp('readAsync', 'readAsync');
    legacyModuleProp('readBinary', 'readBinary');
    legacyModuleProp('setWindowTitle', 'setWindowTitle');
    assert(
      !ENVIRONMENT_IS_SHELL,
      "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable."
    );
    var wasmBinary;
    if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
    legacyModuleProp('wasmBinary', 'wasmBinary');
    if (typeof WebAssembly != 'object') {
      abort('no native wasm support detected');
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    function assert(condition, text) {
      if (!condition) {
        abort('Assertion failed' + (text ? ': ' + text : ''));
      }
    }
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module['HEAP8'] = HEAP8 = new Int8Array(b);
      Module['HEAP16'] = HEAP16 = new Int16Array(b);
      Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
      Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
      Module['HEAP32'] = HEAP32 = new Int32Array(b);
      Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
      Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
      Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
    }
    assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time');
    assert(
      typeof Int32Array != 'undefined' &&
        typeof Float64Array !== 'undefined' &&
        Int32Array.prototype.subarray != undefined &&
        Int32Array.prototype.set != undefined,
      'JS engine does not provide full typed array support'
    );
    assert(
      !Module['wasmMemory'],
      'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally'
    );
    assert(
      !Module['INITIAL_MEMORY'],
      'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically'
    );
    function writeStackCookie() {
      var max = _emscripten_stack_get_end();
      assert((max & 3) == 0);
      if (max == 0) {
        max += 4;
      }
      HEAPU32[max >> 2] = 34821223;
      HEAPU32[(max + 4) >> 2] = 2310721022;
      HEAPU32[0 >> 2] = 1668509029;
    }
    function checkStackCookie() {
      if (ABORT) return;
      var max = _emscripten_stack_get_end();
      if (max == 0) {
        max += 4;
      }
      var cookie1 = HEAPU32[max >> 2];
      var cookie2 = HEAPU32[(max + 4) >> 2];
      if (cookie1 != 34821223 || cookie2 != 2310721022) {
        abort(
          `Stack overflow! Stack cookie has been overwritten at ${ptrToString(
            max
          )}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(
            cookie1
          )}`
        );
      }
      if (HEAPU32[0 >> 2] != 1668509029) {
        abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
      }
    }
    (function () {
      var h16 = new Int16Array(1);
      var h8 = new Int8Array(h16.buffer);
      h16[0] = 25459;
      if (h8[0] !== 115 || h8[1] !== 99)
        throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
    })();
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function preRun() {
      if (Module['preRun']) {
        if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
        while (Module['preRun'].length) {
          addOnPreRun(Module['preRun'].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      assert(!runtimeInitialized);
      runtimeInitialized = true;
      checkStackCookie();
      if (!Module['noFSInit'] && !FS.init.initialized) FS.init();
      FS.ignorePermissions = false;
      TTY.init();
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      checkStackCookie();
      if (Module['postRun']) {
        if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
        while (Module['postRun'].length) {
          addOnPostRun(Module['postRun'].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    assert(
      Math.imul,
      'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill'
    );
    assert(
      Math.fround,
      'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill'
    );
    assert(
      Math.clz32,
      'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill'
    );
    assert(
      Math.trunc,
      'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill'
    );
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    var runDependencyTracking = {};
    function getUniqueRunDependency(id) {
      var orig = id;
      while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
      }
    }
    function addRunDependency(id) {
      runDependencies++;
      if (Module['monitorRunDependencies']) {
        Module['monitorRunDependencies'](runDependencies);
      }
      if (id) {
        assert(!runDependencyTracking[id]);
        runDependencyTracking[id] = 1;
        if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
          runDependencyWatcher = setInterval(() => {
            if (ABORT) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
              return;
            }
            var shown = false;
            for (var dep in runDependencyTracking) {
              if (!shown) {
                shown = true;
                err('still waiting on run dependencies:');
              }
              err(`dependency: ${dep}`);
            }
            if (shown) {
              err('(end of list)');
            }
          }, 1e4);
        }
      } else {
        err('warning: run dependency added without ID');
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module['monitorRunDependencies']) {
        Module['monitorRunDependencies'](runDependencies);
      }
      if (id) {
        assert(runDependencyTracking[id]);
        delete runDependencyTracking[id];
      } else {
        err('warning: run dependency removed without ID');
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      if (Module['onAbort']) {
        Module['onAbort'](what);
      }
      what = 'Aborted(' + what + ')';
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = 'data:application/octet-stream;base64,';
    var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
    var isFileURI = (filename) => filename.startsWith('file://');
    function createExportWrapper(name) {
      return function () {
        assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
        var f = wasmExports[name];
        assert(f, `exported native function \`${name}\` not found`);
        return f.apply(null, arguments);
      };
    }
    var wasmBinaryFile;
    wasmBinaryFile = 'pdfium.wasm';
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      }
      throw 'both async and sync fetching of the wasm failed';
    }
    function getBinaryPromise(binaryFile) {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == 'function' && !isFileURI(binaryFile)) {
          return fetch(binaryFile, { credentials: 'same-origin' })
            .then((response) => {
              if (!response['ok']) {
                throw "failed to load wasm binary file at '" + binaryFile + "'";
              }
              return response['arrayBuffer']();
            })
            .catch(() => getBinarySync(binaryFile));
        } else if (readAsync) {
          return new Promise((resolve, reject) => {
            readAsync(binaryFile, (response) => resolve(new Uint8Array(response)), reject);
          });
        }
      }
      return Promise.resolve().then(() => getBinarySync(binaryFile));
    }
    function instantiateArrayBuffer(binaryFile, imports, receiver) {
      return getBinaryPromise(binaryFile)
        .then((binary) => WebAssembly.instantiate(binary, imports))
        .then((instance) => instance)
        .then(receiver, (reason) => {
          err(`failed to asynchronously prepare wasm: ${reason}`);
          if (isFileURI(wasmBinaryFile)) {
            err(
              `warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`
            );
          }
          abort(reason);
        });
    }
    function instantiateAsync(binary, binaryFile, imports, callback) {
      if (
        !binary &&
        typeof WebAssembly.instantiateStreaming == 'function' &&
        !isDataURI(binaryFile) &&
        !isFileURI(binaryFile) &&
        !ENVIRONMENT_IS_NODE &&
        typeof fetch == 'function'
      ) {
        return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
          var result = WebAssembly.instantiateStreaming(response, imports);
          return result.then(callback, function (reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(binaryFile, imports, callback);
          });
        });
      }
      return instantiateArrayBuffer(binaryFile, imports, callback);
    }
    function createWasm() {
      var info = { env: wasmImports, wasi_snapshot_preview1: wasmImports };
      function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        Module['wasmExports'] = wasmExports;
        wasmMemory = wasmExports['memory'];
        assert(wasmMemory, 'memory not found in wasm exports');
        updateMemoryViews();
        wasmTable = wasmExports['__indirect_function_table'];
        assert(wasmTable, 'table not found in wasm exports');
        addOnInit(wasmExports['__wasm_call_ctors']);
        removeRunDependency('wasm-instantiate');
        return wasmExports;
      }
      addRunDependency('wasm-instantiate');
      var trueModule = Module;
      function receiveInstantiationResult(result) {
        assert(
          Module === trueModule,
          'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?'
        );
        trueModule = null;
        receiveInstance(result['instance']);
      }
      if (Module['instantiateWasm']) {
        try {
          return Module['instantiateWasm'](info, receiveInstance);
        } catch (e) {
          err(`Module.instantiateWasm callback failed with error: ${e}`);
          readyPromiseReject(e);
        }
      }
      instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
      return {};
    }
    var tempDouble;
    var tempI64;
    function legacyModuleProp(prop, newName, incomming = true) {
      if (!Object.getOwnPropertyDescriptor(Module, prop)) {
        Object.defineProperty(Module, prop, {
          configurable: true,
          get() {
            let extra = incomming
              ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'
              : '';
            abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
          },
        });
      }
    }
    function ignoredModuleProp(prop) {
      if (Object.getOwnPropertyDescriptor(Module, prop)) {
        abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
      }
    }
    function isExportedByForceFilesystem(name) {
      return (
        name === 'FS_createPath' ||
        name === 'FS_createDataFile' ||
        name === 'FS_createPreloadedFile' ||
        name === 'FS_unlink' ||
        name === 'addRunDependency' ||
        name === 'FS_createLazyFile' ||
        name === 'FS_createDevice' ||
        name === 'removeRunDependency'
      );
    }
    function missingGlobal(sym, msg) {
      if (typeof globalThis !== 'undefined') {
        Object.defineProperty(globalThis, sym, {
          configurable: true,
          get() {
            warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
            return undefined;
          },
        });
      }
    }
    missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
    missingGlobal('asm', 'Please use wasmExports instead');
    function missingLibrarySymbol(sym) {
      if (typeof globalThis !== 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
        Object.defineProperty(globalThis, sym, {
          configurable: true,
          get() {
            var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
            var librarySymbol = sym;
            if (!librarySymbol.startsWith('_')) {
              librarySymbol = '$' + sym;
            }
            msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
            if (isExportedByForceFilesystem(sym)) {
              msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
            }
            warnOnce(msg);
            return undefined;
          },
        });
      }
      unexportedRuntimeSymbol(sym);
    }
    function unexportedRuntimeSymbol(sym) {
      if (!Object.getOwnPropertyDescriptor(Module, sym)) {
        Object.defineProperty(Module, sym, {
          configurable: true,
          get() {
            var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
            if (isExportedByForceFilesystem(sym)) {
              msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
            }
            abort(msg);
          },
        });
      }
    }
    function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }
    var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };
    var withStackSave = (f) => {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    };
    var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
    var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 1114111)
            warnOnce(
              'Invalid Unicode code point ' +
                ptrToString(u) +
                ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).'
            );
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
    var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(
        typeof maxBytesToWrite == 'number',
        'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!'
      );
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
    var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
    var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
    var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 248) != 240)
            warnOnce(
              'Invalid UTF-8 leading byte ' +
                ptrToString(u0) +
                ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!'
            );
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
      return str;
    };
    var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
    var demangle = (func) => {
      demangle.recursionGuard = (demangle.recursionGuard | 0) + 1;
      if (demangle.recursionGuard > 1) return func;
      return withStackSave(() => {
        try {
          var s = func;
          if (s.startsWith('__Z')) s = s.substr(1);
          var buf = stringToUTF8OnStack(s);
          var status = stackAlloc(4);
          var ret = ___cxa_demangle(buf, 0, 0, status);
          if (HEAP32[status >> 2] === 0 && ret) {
            return UTF8ToString(ret);
          }
        } catch (e) {
        } finally {
          _free(ret);
          if (demangle.recursionGuard < 2) --demangle.recursionGuard;
        }
        return func;
      });
    };
    var noExitRuntime = Module['noExitRuntime'] || true;
    var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };
    function jsStackTrace() {
      var error = new Error();
      if (!error.stack) {
        try {
          throw new Error();
        } catch (e) {
          error = e;
        }
        if (!error.stack) {
          return '(no stack trace available)';
        }
      }
      return error.stack.toString();
    }
    var demangleAll = (text) => {
      var regex = /\b_Z[\w\d_]+/g;
      return text.replace(regex, function (x) {
        var y = demangle(x);
        return x === y ? x : y + ' [' + x + ']';
      });
    };
    var warnOnce = (text) => {
      if (!warnOnce.shown) warnOnce.shown = {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };
    var ___assert_fail = (condition, filename, line, func) => {
      abort(
        `Assertion failed: ${UTF8ToString(condition)}, at: ` +
          [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']
      );
    };
    var setErrNo = (value) => {
      HEAP32[___errno_location() >> 2] = value;
      return value;
    };
    var PATH = {
      isAbs: (path) => path.charAt(0) === '/',
      splitPath: (filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
      normalizeArray: (parts, allowAboveRoot) => {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
      normalize: (path) => {
        var isAbsolute = PATH.isAbs(path),
          trailingSlash = path.substr(-1) === '/';
        path = PATH.normalizeArray(
          path.split('/').filter((p) => !!p),
          !isAbsolute
        ).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
      dirname: (path) => {
        var result = PATH.splitPath(path),
          root = result[0],
          dir = result[1];
        if (!root && !dir) {
          return '.';
        }
        if (dir) {
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },
      basename: (path) => {
        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, '');
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1);
      },
      join: function () {
        var paths = Array.prototype.slice.call(arguments);
        return PATH.normalize(paths.join('/'));
      },
      join2: (l, r) => PATH.normalize(l + '/' + r),
    };
    var initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        return (view) => crypto.getRandomValues(view);
      } else if (ENVIRONMENT_IS_NODE) {
        try {
          var crypto_module = require('crypto');
          var randomFillSync = crypto_module['randomFillSync'];
          if (randomFillSync) {
            return (view) => crypto_module['randomFillSync'](view);
          }
          var randomBytes = crypto_module['randomBytes'];
          return (view) => (view.set(randomBytes(view.byteLength)), view);
        } catch (e) {}
      }
      abort(
        'no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };'
      );
    };
    var randomFill = (view) => (randomFill = initRandomFill())(view);
    var PATH_FS = {
      resolve: function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? arguments[i] : FS.cwd();
          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return '';
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        resolvedPath = PATH.normalizeArray(
          resolvedPath.split('/').filter((p) => !!p),
          !resolvedAbsolute
        ).join('/');
        return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
      },
      relative: (from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      },
    };
    var FS_stdin_getChar_buffer = [];
    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    }
    var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
          var fd = process.stdin.fd;
          try {
            bytesRead = fs.readSync(fd, buf);
          } catch (e) {
            if (e.toString().includes('EOF')) bytesRead = 0;
            else throw e;
          }
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString('utf-8');
          } else {
            result = null;
          }
        } else if (typeof window != 'undefined' && typeof window.prompt == 'function') {
          result = window.prompt('Input: ');
          if (result !== null) {
            result += '\n';
          }
        } else if (typeof readline == 'function') {
          result = readline();
          if (result !== null) {
            result += '\n';
          }
        }
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
    var TTY = {
      ttys: [],
      init() {},
      shutdown() {},
      register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
      stream_ops: {
        open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
        close(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
        fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
        read(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },
        write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        },
      },
      default_tty_ops: {
        get_char(tty) {
          return FS_stdin_getChar();
        },
        put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
        ioctl_tcgets(tty) {
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
          };
        },
        ioctl_tcsets(tty, optional_actions, data) {
          return 0;
        },
        ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
      },
      default_tty1_ops: {
        put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
      },
    };
    var mmapAlloc = (size) => {
      abort('internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported');
    };
    var MEMFS = {
      ops_table: null,
      mount(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511, 0);
      },
      createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink,
              },
              stream: { llseek: MEMFS.stream_ops.llseek },
            },
            file: {
              node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync,
              },
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink,
              },
              stream: {},
            },
            chrdev: {
              node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr },
              stream: FS.chrdev_stream_ops,
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;
          node.contents = null;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },
      getFileDataAsTypedArray(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
      },
      expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
      },
      resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null;
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          }
          node.usedBytes = newSize;
        }
      },
      node_ops: {
        getattr(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
        setattr(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
        lookup(parent, name) {
          throw FS.genericErrors[44];
        },
        mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
        rename(old_node, new_dir, new_name) {
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {}
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now();
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        },
        unlink(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
        rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
        readdir(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },
        symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        },
        readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
      },
      stream_ops: {
        read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },
        write(stream, buffer, offset, length, position, canOwn) {
          assert(!(buffer instanceof ArrayBuffer));
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
          MEMFS.expandFileStorage(node, position + length);
          if (node.contents.subarray && buffer.subarray) {
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
              node.contents[position + i] = buffer[offset + i];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
        llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
        allocate(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },
        mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },
        msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        },
      },
    };
    var asyncLoad = (url, onload, onerror, noRunDep) => {
      var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : '';
      readAsync(
        url,
        (arrayBuffer) => {
          assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        },
        (event) => {
          if (onerror) {
            onerror();
          } else {
            throw `Loading data file "${url}" failed.`;
          }
        }
      );
      if (dep) addRunDependency(dep);
    };
    var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
      FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
    };
    var preloadPlugins = Module['preloadPlugins'] || [];
    var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
      if (typeof Browser != 'undefined') Browser.init();
      var handled = false;
      preloadPlugins.forEach((plugin) => {
        if (handled) return;
        if (plugin['canHandle'](fullname)) {
          plugin['handle'](byteArray, fullname, finish, onerror);
          handled = true;
        }
      });
      return handled;
    };
    var FS_createPreloadedFile = (
      parent,
      name,
      url,
      canRead,
      canWrite,
      onload,
      onerror,
      dontCreateFile,
      canOwn,
      preFinish
    ) => {
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`);
      function processData(byteArray) {
        function finish(byteArray) {
          if (preFinish) preFinish();
          if (!dontCreateFile) {
            FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
          }
          if (onload) onload();
          removeRunDependency(dep);
        }
        if (
          FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
            if (onerror) onerror();
            removeRunDependency(dep);
          })
        ) {
          return;
        }
        finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == 'string') {
        asyncLoad(url, (byteArray) => processData(byteArray), onerror);
      } else {
        processData(url);
      }
    };
    var FS_modeStringToFlags = (str) => {
      var flagModes = { r: 0, 'r+': 2, w: 512 | 64 | 1, 'w+': 512 | 64 | 2, a: 1024 | 64 | 1, 'a+': 1024 | 64 | 2 };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
    var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
    var ERRNO_MESSAGES = {
      0: 'Success',
      1: 'Arg list too long',
      2: 'Permission denied',
      3: 'Address already in use',
      4: 'Address not available',
      5: 'Address family not supported by protocol family',
      6: 'No more processes',
      7: 'Socket already connected',
      8: 'Bad file number',
      9: 'Trying to read unreadable message',
      10: 'Mount device busy',
      11: 'Operation canceled',
      12: 'No children',
      13: 'Connection aborted',
      14: 'Connection refused',
      15: 'Connection reset by peer',
      16: 'File locking deadlock error',
      17: 'Destination address required',
      18: 'Math arg out of domain of func',
      19: 'Quota exceeded',
      20: 'File exists',
      21: 'Bad address',
      22: 'File too large',
      23: 'Host is unreachable',
      24: 'Identifier removed',
      25: 'Illegal byte sequence',
      26: 'Connection already in progress',
      27: 'Interrupted system call',
      28: 'Invalid argument',
      29: 'I/O error',
      30: 'Socket is already connected',
      31: 'Is a directory',
      32: 'Too many symbolic links',
      33: 'Too many open files',
      34: 'Too many links',
      35: 'Message too long',
      36: 'Multihop attempted',
      37: 'File or path name too long',
      38: 'Network interface is not configured',
      39: 'Connection reset by network',
      40: 'Network is unreachable',
      41: 'Too many open files in system',
      42: 'No buffer space available',
      43: 'No such device',
      44: 'No such file or directory',
      45: 'Exec format error',
      46: 'No record locks available',
      47: 'The link has been severed',
      48: 'Not enough core',
      49: 'No message of desired type',
      50: 'Protocol not available',
      51: 'No space left on device',
      52: 'Function not implemented',
      53: 'Socket is not connected',
      54: 'Not a directory',
      55: 'Directory not empty',
      56: 'State not recoverable',
      57: 'Socket operation on non-socket',
      59: 'Not a typewriter',
      60: 'No such device or address',
      61: 'Value too large for defined data type',
      62: 'Previous owner died',
      63: 'Not super-user',
      64: 'Broken pipe',
      65: 'Protocol error',
      66: 'Unknown protocol',
      67: 'Protocol wrong type for socket',
      68: 'Math result not representable',
      69: 'Read only file system',
      70: 'Illegal seek',
      71: 'No such process',
      72: 'Stale file handle',
      73: 'Connection timed out',
      74: 'Text file busy',
      75: 'Cross-device link',
      100: 'Device not a stream',
      101: 'Bad font file fmt',
      102: 'Invalid slot',
      103: 'Invalid request code',
      104: 'No anode',
      105: 'Block device required',
      106: 'Channel number out of range',
      107: 'Level 3 halted',
      108: 'Level 3 reset',
      109: 'Link number out of range',
      110: 'Protocol driver not attached',
      111: 'No CSI structure available',
      112: 'Level 2 halted',
      113: 'Invalid exchange',
      114: 'Invalid request descriptor',
      115: 'Exchange full',
      116: 'No data (for no delay io)',
      117: 'Timer expired',
      118: 'Out of streams resources',
      119: 'Machine is not on the network',
      120: 'Package not installed',
      121: 'The object is remote',
      122: 'Advertise error',
      123: 'Srmount error',
      124: 'Communication error on send',
      125: 'Cross mount point (not really error)',
      126: 'Given log. name not unique',
      127: 'f.d. invalid for this operation',
      128: 'Remote address changed',
      129: 'Can   access a needed shared lib',
      130: 'Accessing a corrupted shared lib',
      131: '.lib section in a.out corrupted',
      132: 'Attempting to link in too many libs',
      133: 'Attempting to exec a shared library',
      135: 'Streams pipe error',
      136: 'Too many users',
      137: 'Socket type not supported',
      138: 'Not supported',
      139: 'Protocol family not supported',
      140: "Can't send after socket shutdown",
      141: 'Too many references',
      142: 'Host is down',
      148: 'No medium (in tape drive)',
      156: 'Level 2 not synchronized',
    };
    var ERRNO_CODES = {
      EPERM: 63,
      ENOENT: 44,
      ESRCH: 71,
      EINTR: 27,
      EIO: 29,
      ENXIO: 60,
      E2BIG: 1,
      ENOEXEC: 45,
      EBADF: 8,
      ECHILD: 12,
      EAGAIN: 6,
      EWOULDBLOCK: 6,
      ENOMEM: 48,
      EACCES: 2,
      EFAULT: 21,
      ENOTBLK: 105,
      EBUSY: 10,
      EEXIST: 20,
      EXDEV: 75,
      ENODEV: 43,
      ENOTDIR: 54,
      EISDIR: 31,
      EINVAL: 28,
      ENFILE: 41,
      EMFILE: 33,
      ENOTTY: 59,
      ETXTBSY: 74,
      EFBIG: 22,
      ENOSPC: 51,
      ESPIPE: 70,
      EROFS: 69,
      EMLINK: 34,
      EPIPE: 64,
      EDOM: 18,
      ERANGE: 68,
      ENOMSG: 49,
      EIDRM: 24,
      ECHRNG: 106,
      EL2NSYNC: 156,
      EL3HLT: 107,
      EL3RST: 108,
      ELNRNG: 109,
      EUNATCH: 110,
      ENOCSI: 111,
      EL2HLT: 112,
      EDEADLK: 16,
      ENOLCK: 46,
      EBADE: 113,
      EBADR: 114,
      EXFULL: 115,
      ENOANO: 104,
      EBADRQC: 103,
      EBADSLT: 102,
      EDEADLOCK: 16,
      EBFONT: 101,
      ENOSTR: 100,
      ENODATA: 116,
      ETIME: 117,
      ENOSR: 118,
      ENONET: 119,
      ENOPKG: 120,
      EREMOTE: 121,
      ENOLINK: 47,
      EADV: 122,
      ESRMNT: 123,
      ECOMM: 124,
      EPROTO: 65,
      EMULTIHOP: 36,
      EDOTDOT: 125,
      EBADMSG: 9,
      ENOTUNIQ: 126,
      EBADFD: 127,
      EREMCHG: 128,
      ELIBACC: 129,
      ELIBBAD: 130,
      ELIBSCN: 131,
      ELIBMAX: 132,
      ELIBEXEC: 133,
      ENOSYS: 52,
      ENOTEMPTY: 55,
      ENAMETOOLONG: 37,
      ELOOP: 32,
      EOPNOTSUPP: 138,
      EPFNOSUPPORT: 139,
      ECONNRESET: 15,
      ENOBUFS: 42,
      EAFNOSUPPORT: 5,
      EPROTOTYPE: 67,
      ENOTSOCK: 57,
      ENOPROTOOPT: 50,
      ESHUTDOWN: 140,
      ECONNREFUSED: 14,
      EADDRINUSE: 3,
      ECONNABORTED: 13,
      ENETUNREACH: 40,
      ENETDOWN: 38,
      ETIMEDOUT: 73,
      EHOSTDOWN: 142,
      EHOSTUNREACH: 23,
      EINPROGRESS: 26,
      EALREADY: 7,
      EDESTADDRREQ: 17,
      EMSGSIZE: 35,
      EPROTONOSUPPORT: 66,
      ESOCKTNOSUPPORT: 137,
      EADDRNOTAVAIL: 4,
      ENETRESET: 39,
      EISCONN: 30,
      ENOTCONN: 53,
      ETOOMANYREFS: 141,
      EUSERS: 136,
      EDQUOT: 19,
      ESTALE: 72,
      ENOTSUP: 138,
      ENOMEDIUM: 148,
      EILSEQ: 25,
      EOVERFLOW: 61,
      ECANCELED: 11,
      ENOTRECOVERABLE: 56,
      EOWNERDEAD: 62,
      ESTRPIPE: 135,
    };
    var FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: '/',
      initialized: false,
      ignorePermissions: true,
      ErrnoError: null,
      genericErrors: {},
      filesystems: null,
      syncFSRequests: 0,
      lookupPath(path, opts = {}) {
        path = PATH_FS.resolve(path);
        if (!path) return { path: '', node: null };
        var defaults = { follow_mount: true, recurse_count: 0 };
        opts = Object.assign(defaults, opts);
        if (opts.recurse_count > 8) {
          throw new FS.ErrnoError(32);
        }
        var parts = path.split('/').filter((p) => !!p);
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = i === parts.length - 1;
          if (islast && opts.parent) {
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;
              if (count++ > 40) {
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },
      getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length - 1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
      hashName(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
      hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
      hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
      lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        return FS.lookup(parent, name);
      },
      createNode(parent, name, mode, rdev) {
        assert(typeof parent == 'object');
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
      },
      destroyNode(node) {
        FS.hashRemoveNode(node);
      },
      isRoot(node) {
        return node === node.parent;
      },
      isMountpoint(node) {
        return !!node.mounted;
      },
      isFile(mode) {
        return (mode & 61440) === 32768;
      },
      isDir(mode) {
        return (mode & 61440) === 16384;
      },
      isLink(mode) {
        return (mode & 61440) === 40960;
      },
      isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
      isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
      isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
      isSocket(mode) {
        return (mode & 49152) === 49152;
      },
      flagsToPermissionString(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if (flag & 512) {
          perms += 'w';
        }
        return perms;
      },
      nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
      mayLookup(dir) {
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
      mayCreate(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {}
        return FS.nodePermissions(dir, 'wx');
      },
      mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
      mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || flags & 512) {
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
      MAX_OPEN_FDS: 4096,
      nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
      getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
      getStream: (fd) => FS.streams[fd],
      createStream(stream, fd = -1) {
        if (!FS.FSStream) {
          FS.FSStream = function () {
            this.shared = {};
          };
          FS.FSStream.prototype = {};
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get() {
                return this.node;
              },
              set(val) {
                this.node = val;
              },
            },
            isRead: {
              get() {
                return (this.flags & 2097155) !== 1;
              },
            },
            isWrite: {
              get() {
                return (this.flags & 2097155) !== 0;
              },
            },
            isAppend: {
              get() {
                return this.flags & 1024;
              },
            },
            flags: {
              get() {
                return this.shared.flags;
              },
              set(val) {
                this.shared.flags = val;
              },
            },
            position: {
              get() {
                return this.shared.position;
              },
              set(val) {
                this.shared.position = val;
              },
            },
          });
        }
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
      closeStream(fd) {
        FS.streams[fd] = null;
      },
      chrdev_stream_ops: {
        open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },
        llseek() {
          throw new FS.ErrnoError(70);
        },
      },
      major: (dev) => dev >> 8,
      minor: (dev) => dev & 255,
      makedev: (ma, mi) => (ma << 8) | mi,
      registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
      getDevice: (dev) => FS.devices[dev],
      getMounts(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push.apply(check, m.mounts);
        }
        return mounts;
      },
      syncfs(populate, callback) {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        }
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },
      mount(type, opts, mountpoint) {
        if (typeof type == 'string') {
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          mountpoint = lookup.path;
          node = lookup.node;
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
        var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          node.mounted = mount;
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
        return mountRoot;
      },
      unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
          while (current) {
            var next = current.name_next;
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
            current = next;
          }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
      lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
      mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
      create(path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
      mkdir(path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
      mkdirTree(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
        }
      },
      mkdev(path, mode, dev) {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
      symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
      rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (old_node === new_node) {
          return;
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        FS.hashRemoveNode(old_node);
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          FS.hashAddNode(old_node);
        }
      },
      rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
      readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },
      unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
      readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },
      stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },
      lstat(path) {
        return FS.stat(path, true);
      },
      chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, { mode: (mode & 4095) | (node.mode & ~4095), timestamp: Date.now() });
      },
      lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
      fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.chmod(stream.node, mode);
      },
      chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, { timestamp: Date.now() });
      },
      lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
      fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.chown(stream.node, uid, gid);
      },
      truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
      },
      ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },
      utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
      },
      open(path, flags, mode) {
        if (path === '') {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS_modeStringToFlags(flags) : flags;
        mode = typeof mode == 'undefined' ? 438 : mode;
        if (flags & 64) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
            node = lookup.node;
          } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS.ErrnoError(20);
            }
          } else {
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        if (flags & 512 && !created) {
          FS.truncate(node, 0);
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          ungotten: [],
          error: false,
        });
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
      close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null;
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
      isClosed(stream) {
        return stream.fd === null;
      },
      llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
      read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
      write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
      allocate(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },
      mmap(stream, length, position, prot, flags) {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
      msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
      munmap: (stream) => 0,
      ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
      readFile(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },
      writeFile(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },
      cwd: () => FS.currentPath,
      chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
      createDefaultDirectories() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },
      createDefaultDevices() {
        FS.mkdir('/dev');
        FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (stream, buffer, offset, length, pos) => length });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        var randomBuffer = new Uint8Array(1024),
          randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomLeft = randomFill(randomBuffer).byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },
      createSpecialDirectories() {
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount(
          {
            mount() {
              var node = FS.createNode(proc_self, 'fd', 16384 | 511, 73);
              node.node_ops = {
                lookup(parent, name) {
                  var fd = +name;
                  var stream = FS.getStreamChecked(fd);
                  var ret = { parent: null, mount: { mountpoint: 'fake' }, node_ops: { readlink: () => stream.path } };
                  ret.parent = ret;
                  return ret;
                },
              };
              return node;
            },
          },
          {},
          '/proc/self/fd'
        );
      },
      createStandardStreams() {
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
      ensureErrnoError() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          this.name = 'ErrnoError';
          this.node = node;
          this.setErrno = function (errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
          if (this.stack) {
            Object.defineProperty(this, 'stack', { value: new Error().stack, writable: true });
            this.stack = demangleAll(this.stack);
          }
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },
      staticInit() {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = { MEMFS: MEMFS };
      },
      init(input, output, error) {
        assert(
          !FS.init.initialized,
          'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)'
        );
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },
      quit() {
        FS.init.initialized = false;
        _fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },
      findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
      analyzePath(path, dontResolveLastLink) {
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {}
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null,
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        }
        return ret;
      },
      createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {}
          parent = current;
        }
        return current;
      },
      createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
      createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
      createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          },
        });
        return FS.mkdev(path, mode, dev);
      },
      forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error(
            'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
          );
        } else if (read_) {
          try {
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
      },
      createLazyFile(parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = [];
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length - 1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize) | 0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
            throw new Error("Couldn't load " + url + '. Status: ' + xhr.status);
          var datalength = Number(xhr.getResponseHeader('Content-length'));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader('Accept-Ranges')) && header === 'bytes';
          var usesGzip = (header = xhr.getResponseHeader('Content-Encoding')) && header === 'gzip';
          var chunkSize = 1024 * 1024;
          if (!hasByteServing) chunkSize = datalength;
          var doXHR = (from, to) => {
            if (from > to) throw new Error('invalid range (' + from + ', ' + to + ') or no bytes requested!');
            if (to > datalength - 1) throw new Error('only ' + datalength + ' bytes available! programmer error!');
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader('Range', 'bytes=' + from + '-' + to);
            xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.send(null);
            if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
              throw new Error("Couldn't load " + url + '. Status: ' + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            }
            return intArrayFromString(xhr.responseText || '', true);
          };
          var lazyArray = this;
          lazyArray.setDataGetter((chunkNum) => {
            var start = chunkNum * chunkSize;
            var end = (chunkNum + 1) * chunkSize - 1;
            end = Math.min(end, datalength - 1);
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
            return lazyArray.chunks[chunkNum];
          });
          if (usesGzip || !datalength) {
            chunkSize = datalength = 1;
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out('LazyFiles on gzip forces download of the whole file when length is accessed');
          }
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER)
            throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              },
            },
            chunkSize: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              },
            },
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        Object.defineProperties(node, {
          usedBytes: {
            get: function () {
              return this.contents.length;
            },
          },
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length) return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position);
        };
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr: ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
      absolutePath() {
        abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
      },
      createFolder() {
        abort('FS.createFolder has been removed; use FS.mkdir instead');
      },
      createLink() {
        abort('FS.createLink has been removed; use FS.symlink instead');
      },
      joinPath() {
        abort('FS.joinPath has been removed; use PATH.join instead');
      },
      mmapAlloc() {
        abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
      },
      standardizePath() {
        abort('FS.standardizePath has been removed; use PATH.normalize instead');
      },
    };
    var SYSCALLS = {
      DEFAULT_POLLMASK: 5,
      calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },
      doStat(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            return -54;
          }
          throw e;
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[(buf + 4) >> 2] = stat.mode;
        HEAPU32[(buf + 8) >> 2] = stat.nlink;
        HEAP32[(buf + 12) >> 2] = stat.uid;
        HEAP32[(buf + 16) >> 2] = stat.gid;
        HEAP32[(buf + 20) >> 2] = stat.rdev;
        (tempI64 = [
          stat.size >>> 0,
          ((tempDouble = stat.size),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 24) >> 2] = tempI64[0]),
          (HEAP32[(buf + 28) >> 2] = tempI64[1]);
        HEAP32[(buf + 32) >> 2] = 4096;
        HEAP32[(buf + 36) >> 2] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        (tempI64 = [
          Math.floor(atime / 1e3) >>> 0,
          ((tempDouble = Math.floor(atime / 1e3)),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 40) >> 2] = tempI64[0]),
          (HEAP32[(buf + 44) >> 2] = tempI64[1]);
        HEAPU32[(buf + 48) >> 2] = (atime % 1e3) * 1e3;
        (tempI64 = [
          Math.floor(mtime / 1e3) >>> 0,
          ((tempDouble = Math.floor(mtime / 1e3)),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 56) >> 2] = tempI64[0]),
          (HEAP32[(buf + 60) >> 2] = tempI64[1]);
        HEAPU32[(buf + 64) >> 2] = (mtime % 1e3) * 1e3;
        (tempI64 = [
          Math.floor(ctime / 1e3) >>> 0,
          ((tempDouble = Math.floor(ctime / 1e3)),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 72) >> 2] = tempI64[0]),
          (HEAP32[(buf + 76) >> 2] = tempI64[1]);
        HEAPU32[(buf + 80) >> 2] = (ctime % 1e3) * 1e3;
        (tempI64 = [
          stat.ino >>> 0,
          ((tempDouble = stat.ino),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 88) >> 2] = tempI64[0]),
          (HEAP32[(buf + 92) >> 2] = tempI64[1]);
        return 0;
      },
      doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
      varargs: undefined,
      get() {
        assert(SYSCALLS.varargs != undefined);
        var ret = HEAP32[+SYSCALLS.varargs >> 2];
        SYSCALLS.varargs += 4;
        return ret;
      },
      getp() {
        return SYSCALLS.get();
      },
      getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
      getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
    };
    function ___syscall_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
          case 0: {
            var arg = SYSCALLS.get();
            if (arg < 0) {
              return -28;
            }
            while (FS.streams[arg]) {
              arg++;
            }
            var newStream;
            newStream = FS.createStream(stream, arg);
            return newStream.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return stream.flags;
          case 4: {
            var arg = SYSCALLS.get();
            stream.flags |= arg;
            return 0;
          }
          case 5: {
            var arg = SYSCALLS.getp();
            var offset = 0;
            HEAP16[(arg + offset) >> 1] = 2;
            return 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            setErrNo(28);
            return -1;
          default: {
            return -28;
          }
        }
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_fstat64(fd, buf) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return SYSCALLS.doStat(FS.stat, stream.path, buf);
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    var convertI32PairToI53Checked = (lo, hi) => {
      assert(lo == lo >>> 0 || lo == (lo | 0));
      assert(hi === (hi | 0));
      return (hi + 2097152) >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
    };
    function ___syscall_ftruncate64(fd, length_low, length_high) {
      var length = convertI32PairToI53Checked(length_low, length_high);
      try {
        if (isNaN(length)) return 61;
        FS.ftruncate(fd, length);
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_getdents64(fd, dirp, count) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (!stream.getdents) {
          stream.getdents = FS.readdir(stream.path);
        }
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
        var idx = Math.floor(off / struct_size);
        while (idx < stream.getdents.length && pos + struct_size <= count) {
          var id;
          var type;
          var name = stream.getdents[idx];
          if (name === '.') {
            id = stream.node.id;
            type = 4;
          } else if (name === '..') {
            var lookup = FS.lookupPath(stream.path, { parent: true });
            id = lookup.node.id;
            type = 4;
          } else {
            var child = FS.lookupNode(stream.node, name);
            id = child.id;
            type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
          }
          assert(id);
          (tempI64 = [
            id >>> 0,
            ((tempDouble = id),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? +Math.floor(tempDouble / 4294967296) >>> 0
                : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
              : 0),
          ]),
            (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
            (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
          (tempI64 = [
            ((idx + 1) * struct_size) >>> 0,
            ((tempDouble = (idx + 1) * struct_size),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? +Math.floor(tempDouble / 4294967296) >>> 0
                : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
              : 0),
          ]),
            (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
            (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
          HEAP16[(dirp + pos + 16) >> 1] = 280;
          HEAP8[(dirp + pos + 18) >> 0] = type;
          stringToUTF8(name, dirp + pos + 19, 256);
          pos += struct_size;
          idx += 1;
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
          case 21509: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21505: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tcgets) {
              var termios = stream.tty.ops.ioctl_tcgets(stream);
              var argp = SYSCALLS.getp();
              HEAP32[argp >> 2] = termios.c_iflag || 0;
              HEAP32[(argp + 4) >> 2] = termios.c_oflag || 0;
              HEAP32[(argp + 8) >> 2] = termios.c_cflag || 0;
              HEAP32[(argp + 12) >> 2] = termios.c_lflag || 0;
              for (var i = 0; i < 32; i++) {
                HEAP8[(argp + i + 17) >> 0] = termios.c_cc[i] || 0;
              }
              return 0;
            }
            return 0;
          }
          case 21510:
          case 21511:
          case 21512: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21506:
          case 21507:
          case 21508: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tcsets) {
              var argp = SYSCALLS.getp();
              var c_iflag = HEAP32[argp >> 2];
              var c_oflag = HEAP32[(argp + 4) >> 2];
              var c_cflag = HEAP32[(argp + 8) >> 2];
              var c_lflag = HEAP32[(argp + 12) >> 2];
              var c_cc = [];
              for (var i = 0; i < 32; i++) {
                c_cc.push(HEAP8[(argp + i + 17) >> 0]);
              }
              return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                c_iflag: c_iflag,
                c_oflag: c_oflag,
                c_cflag: c_cflag,
                c_lflag: c_lflag,
                c_cc: c_cc,
              });
            }
            return 0;
          }
          case 21519: {
            if (!stream.tty) return -59;
            var argp = SYSCALLS.getp();
            HEAP32[argp >> 2] = 0;
            return 0;
          }
          case 21520: {
            if (!stream.tty) return -59;
            return -28;
          }
          case 21531: {
            var argp = SYSCALLS.getp();
            return FS.ioctl(stream, op, argp);
          }
          case 21523: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tiocgwinsz) {
              var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
              var argp = SYSCALLS.getp();
              HEAP16[argp >> 1] = winsize[0];
              HEAP16[(argp + 2) >> 1] = winsize[1];
            }
            return 0;
          }
          case 21524: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21515: {
            if (!stream.tty) return -59;
            return 0;
          }
          default:
            return -28;
        }
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_lstat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.lstat, path, buf);
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_newfstatat(dirfd, path, buf, flags) {
      try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        var allowEmpty = flags & 4096;
        flags = flags & ~6400;
        assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
        path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
        return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        var mode = varargs ? SYSCALLS.get() : 0;
        return FS.open(path, flags, mode).fd;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_rmdir(path) {
      try {
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_stat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.stat, path, buf);
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    function ___syscall_unlinkat(dirfd, path, flags) {
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (flags === 0) {
          FS.unlink(path);
        } else if (flags === 512) {
          FS.rmdir(path);
        } else {
          abort('Invalid flags passed to unlinkat');
        }
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return -e.errno;
      }
    }
    var __emscripten_throw_longjmp = () => {
      throw Infinity;
    };
    function __gmtime_js(time_low, time_high, tmPtr) {
      var time = convertI32PairToI53Checked(time_low, time_high);
      var date = new Date(time * 1e3);
      HEAP32[tmPtr >> 2] = date.getUTCSeconds();
      HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
      HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
      HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
      HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
      HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
      HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
      HEAP32[(tmPtr + 28) >> 2] = yday;
    }
    var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
      return yday;
    };
    function __localtime_js(time_low, time_high, tmPtr) {
      var time = convertI32PairToI53Checked(time_low, time_high);
      var date = new Date(time * 1e3);
      HEAP32[tmPtr >> 2] = date.getSeconds();
      HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
      HEAP32[(tmPtr + 8) >> 2] = date.getHours();
      HEAP32[(tmPtr + 12) >> 2] = date.getDate();
      HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
      HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
      HEAP32[(tmPtr + 24) >> 2] = date.getDay();
      var yday = ydayFromDate(date) | 0;
      HEAP32[(tmPtr + 28) >> 2] = yday;
      HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
      HEAP32[(tmPtr + 32) >> 2] = dst;
    }
    var stringToNewUTF8 = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8(str, ret, size);
      return ret;
    };
    var __tzset_js = (timezone, daylight, tzname) => {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
      HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
      HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : 'GMT';
      }
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = stringToNewUTF8(winterName);
      var summerNamePtr = stringToNewUTF8(summerName);
      if (summerOffset < winterOffset) {
        HEAPU32[tzname >> 2] = winterNamePtr;
        HEAPU32[(tzname + 4) >> 2] = summerNamePtr;
      } else {
        HEAPU32[tzname >> 2] = summerNamePtr;
        HEAPU32[(tzname + 4) >> 2] = winterNamePtr;
      }
    };
    var _abort = () => {
      abort('native code called abort()');
    };
    var _emscripten_date_now = () => Date.now();
    var _emscripten_errn = (str, len) => err(UTF8ToString(str, len));
    var _emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
    var getHeapMax = () => 2147483648;
    var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = (size - b.byteLength + 65535) / 65536;
      try {
        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1;
      } catch (e) {
        err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
      }
    };
    var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      requestedSize >>>= 0;
      assert(requestedSize > oldSize);
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
        return false;
      }
      var alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = growMemory(newSize);
        if (replacement) {
          return true;
        }
      }
      err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
      return false;
    };
    var ENV = {};
    var getExecutableName = () => thisProgram || './this.program';
    var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        var lang =
          ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') +
          '.UTF-8';
        var env = {
          USER: 'web_user',
          LOGNAME: 'web_user',
          PATH: '/',
          PWD: '/',
          HOME: '/home/web_user',
          LANG: lang,
          _: getExecutableName(),
        };
        for (var x in ENV) {
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
    var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
        HEAP8[buffer++ >> 0] = str.charCodeAt(i);
      }
      HEAP8[buffer >> 0] = 0;
    };
    var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[(__environ + i * 4) >> 2] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };
    var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach((string) => (bufSize += string.length + 1));
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    };
    function _fd_close(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return e.errno;
      }
    }
    var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
        if (typeof offset !== 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
    function _fd_read(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return e.errno;
      }
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      var offset = convertI32PairToI53Checked(offset_low, offset_high);
      try {
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.llseek(stream, offset, whence);
        (tempI64 = [
          stream.position >>> 0,
          ((tempDouble = stream.position),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[newOffset >> 2] = tempI64[0]),
          (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return e.errno;
      }
    }
    function _fd_sync(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (stream.stream_ops && stream.stream_ops.fsync) {
          return stream.stream_ops.fsync(stream);
        }
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return e.errno;
      }
    }
    var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (typeof offset !== 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
    function _fd_write(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
        return e.errno;
      }
    }
    var arraySum = (array, index) => {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {}
      return sum;
    };
    var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var addDays = (date, days) => {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1;
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1);
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
        } else {
          newDate.setDate(newDate.getDate() + days);
          return newDate;
        }
      }
      return newDate;
    };
    var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)');
      HEAP8.set(array, buffer);
    };
    var _strftime = (s, maxsize, format, tm) => {
      var tm_zone = HEAPU32[(tm + 40) >> 2];
      var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[(tm + 4) >> 2],
        tm_hour: HEAP32[(tm + 8) >> 2],
        tm_mday: HEAP32[(tm + 12) >> 2],
        tm_mon: HEAP32[(tm + 16) >> 2],
        tm_year: HEAP32[(tm + 20) >> 2],
        tm_wday: HEAP32[(tm + 24) >> 2],
        tm_yday: HEAP32[(tm + 28) >> 2],
        tm_isdst: HEAP32[(tm + 32) >> 2],
        tm_gmtoff: HEAP32[(tm + 36) >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : '',
      };
      var pattern = UTF8ToString(format);
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',
        '%D': '%m/%d/%y',
        '%F': '%Y-%m-%d',
        '%h': '%b',
        '%r': '%I:%M:%S %p',
        '%R': '%H:%M',
        '%T': '%H:%M:%S',
        '%x': '%m/%d/%y',
        '%X': '%H:%M:%S',
        '%Ec': '%c',
        '%EC': '%C',
        '%Ex': '%m/%d/%y',
        '%EX': '%H:%M:%S',
        '%Ey': '%y',
        '%EY': '%Y',
        '%Od': '%d',
        '%Oe': '%e',
        '%OH': '%H',
        '%OI': '%I',
        '%Om': '%m',
        '%OM': '%M',
        '%OS': '%S',
        '%Ou': '%u',
        '%OU': '%U',
        '%OV': '%V',
        '%Ow': '%w',
        '%OW': '%W',
        '%Oy': '%y',
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      function leadingSomething(value, digits, character) {
        var str = typeof value == 'number' ? value.toString() : value || '';
        while (str.length < digits) {
          str = character[0] + str;
        }
        return str;
      }
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate());
          }
        }
        return compare;
      }
      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29);
          case 1:
            return janFourth;
          case 2:
            return new Date(janFourth.getFullYear(), 0, 3);
          case 3:
            return new Date(janFourth.getFullYear(), 0, 2);
          case 4:
            return new Date(janFourth.getFullYear(), 0, 1);
          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
      }
      function getWeekBasedYear(date) {
        var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1;
          }
          return thisDate.getFullYear();
        }
        return thisDate.getFullYear() - 1;
      }
      var EXPANSION_RULES_2 = {
        '%a': (date) => WEEKDAYS[date.tm_wday].substring(0, 3),
        '%A': (date) => WEEKDAYS[date.tm_wday],
        '%b': (date) => MONTHS[date.tm_mon].substring(0, 3),
        '%B': (date) => MONTHS[date.tm_mon],
        '%C': (date) => {
          var year = date.tm_year + 1900;
          return leadingNulls((year / 100) | 0, 2);
        },
        '%d': (date) => leadingNulls(date.tm_mday, 2),
        '%e': (date) => leadingSomething(date.tm_mday, 2, ' '),
        '%g': (date) => getWeekBasedYear(date).toString().substring(2),
        '%G': (date) => getWeekBasedYear(date),
        '%H': (date) => leadingNulls(date.tm_hour, 2),
        '%I': (date) => {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': (date) =>
          leadingNulls(
            date.tm_mday +
              arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1),
            3
          ),
        '%m': (date) => leadingNulls(date.tm_mon + 1, 2),
        '%M': (date) => leadingNulls(date.tm_min, 2),
        '%n': () => '\n',
        '%p': (date) => {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          }
          return 'PM';
        },
        '%S': (date) => leadingNulls(date.tm_sec, 2),
        '%t': () => '\t',
        '%u': (date) => date.tm_wday || 7,
        '%U': (date) => {
          var days = date.tm_yday + 7 - date.tm_wday;
          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%V': (date) => {
          var val = Math.floor((date.tm_yday + 7 - ((date.tm_wday + 6) % 7)) / 7);
          if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
            val++;
          }
          if (!val) {
            val = 52;
            var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
            if (dec31 == 4 || (dec31 == 5 && isLeapYear((date.tm_year % 400) - 1))) {
              val++;
            }
          } else if (val == 53) {
            var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
            if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
          }
          return leadingNulls(val, 2);
        },
        '%w': (date) => date.tm_wday,
        '%W': (date) => {
          var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%y': (date) => (date.tm_year + 1900).toString().substring(2),
        '%Y': (date) => date.tm_year + 1900,
        '%z': (date) => {
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          off = (off / 60) * 100 + (off % 60);
          return (ahead ? '+' : '-') + String('0000' + off).slice(-4);
        },
        '%Z': (date) => date.tm_zone,
        '%%': () => '%',
      };
      pattern = pattern.replace(/%%/g, '\0\0');
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
      pattern = pattern.replace(/\0\0/g, '%');
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
      writeArrayToMemory(bytes, s);
      return bytes.length - 1;
    };
    var _strftime_l = (s, maxsize, format, tm, loc) => _strftime(s, maxsize, format, tm);
    var wasmTableMirror = [];
    var wasmTable;
    var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, 'JavaScript-side Wasm function table mirror is out of date!');
      return func;
    };
    var getCFunc = (ident) => {
      var func = Module['_' + ident];
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    };
    var ccall = (ident, returnType, argTypes, args, opts) => {
      var toC = {
        string: (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) {
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        array: (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        },
      };
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
      ret = onDone(ret);
      return ret;
    };
    var cwrap = (ident, returnType, argTypes, opts) =>
      function () {
        return ccall(ident, returnType, argTypes, arguments, opts);
      };
    var FSNode = function (parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.mounted = null;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.node_ops = {};
      this.stream_ops = {};
      this.rdev = rdev;
    };
    var readMode = 292 | 73;
    var writeMode = 146;
    Object.defineProperties(FSNode.prototype, {
      read: {
        get: function () {
          return (this.mode & readMode) === readMode;
        },
        set: function (val) {
          val ? (this.mode |= readMode) : (this.mode &= ~readMode);
        },
      },
      write: {
        get: function () {
          return (this.mode & writeMode) === writeMode;
        },
        set: function (val) {
          val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
        },
      },
      isFolder: {
        get: function () {
          return FS.isDir(this.mode);
        },
      },
      isDevice: {
        get: function () {
          return FS.isChrdev(this.mode);
        },
      },
    });
    FS.FSNode = FSNode;
    FS.createPreloadedFile = FS_createPreloadedFile;
    FS.staticInit();
    function checkIncomingModuleAPI() {
      ignoredModuleProp('fetchSettings');
    }
    var wasmImports = {
      __assert_fail: ___assert_fail,
      __syscall_fcntl64: ___syscall_fcntl64,
      __syscall_fstat64: ___syscall_fstat64,
      __syscall_ftruncate64: ___syscall_ftruncate64,
      __syscall_getdents64: ___syscall_getdents64,
      __syscall_ioctl: ___syscall_ioctl,
      __syscall_lstat64: ___syscall_lstat64,
      __syscall_newfstatat: ___syscall_newfstatat,
      __syscall_openat: ___syscall_openat,
      __syscall_rmdir: ___syscall_rmdir,
      __syscall_stat64: ___syscall_stat64,
      __syscall_unlinkat: ___syscall_unlinkat,
      _emscripten_throw_longjmp: __emscripten_throw_longjmp,
      _gmtime_js: __gmtime_js,
      _localtime_js: __localtime_js,
      _tzset_js: __tzset_js,
      abort: _abort,
      emscripten_date_now: _emscripten_date_now,
      emscripten_errn: _emscripten_errn,
      emscripten_memcpy_js: _emscripten_memcpy_js,
      emscripten_resize_heap: _emscripten_resize_heap,
      environ_get: _environ_get,
      environ_sizes_get: _environ_sizes_get,
      fd_close: _fd_close,
      fd_read: _fd_read,
      fd_seek: _fd_seek,
      fd_sync: _fd_sync,
      fd_write: _fd_write,
      invoke_ii: invoke_ii,
      invoke_iii: invoke_iii,
      invoke_iiii: invoke_iiii,
      invoke_iiiii: invoke_iiiii,
      invoke_v: invoke_v,
      invoke_vi: invoke_vi,
      invoke_viii: invoke_viii,
      invoke_viiii: invoke_viiii,
      strftime_l: _strftime_l,
    };
    var wasmExports = createWasm();
    var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors');
    var _PDFium_Init = (Module['_PDFium_Init'] = createExportWrapper('PDFium_Init'));
    var _FPDF_InitLibraryWithConfig = (Module['_FPDF_InitLibraryWithConfig'] =
      createExportWrapper('FPDF_InitLibraryWithConfig'));
    var _FPDFAnnot_IsSupportedSubtype = (Module['_FPDFAnnot_IsSupportedSubtype'] =
      createExportWrapper('FPDFAnnot_IsSupportedSubtype'));
    var _FPDFPage_CreateAnnot = (Module['_FPDFPage_CreateAnnot'] = createExportWrapper('FPDFPage_CreateAnnot'));
    var _FPDFPage_GetAnnotCount = (Module['_FPDFPage_GetAnnotCount'] = createExportWrapper('FPDFPage_GetAnnotCount'));
    var _FPDFPage_GetAnnot = (Module['_FPDFPage_GetAnnot'] = createExportWrapper('FPDFPage_GetAnnot'));
    var _FPDFPage_GetAnnotIndex = (Module['_FPDFPage_GetAnnotIndex'] = createExportWrapper('FPDFPage_GetAnnotIndex'));
    var _FPDFPage_CloseAnnot = (Module['_FPDFPage_CloseAnnot'] = createExportWrapper('FPDFPage_CloseAnnot'));
    var _FPDFPage_RemoveAnnot = (Module['_FPDFPage_RemoveAnnot'] = createExportWrapper('FPDFPage_RemoveAnnot'));
    var _FPDFAnnot_GetSubtype = (Module['_FPDFAnnot_GetSubtype'] = createExportWrapper('FPDFAnnot_GetSubtype'));
    var _FPDFAnnot_IsObjectSupportedSubtype = (Module['_FPDFAnnot_IsObjectSupportedSubtype'] = createExportWrapper(
      'FPDFAnnot_IsObjectSupportedSubtype'
    ));
    var _FPDFAnnot_UpdateObject = (Module['_FPDFAnnot_UpdateObject'] = createExportWrapper('FPDFAnnot_UpdateObject'));
    var _FPDFAnnot_AddInkStroke = (Module['_FPDFAnnot_AddInkStroke'] = createExportWrapper('FPDFAnnot_AddInkStroke'));
    var _FPDFAnnot_RemoveInkList = (Module['_FPDFAnnot_RemoveInkList'] =
      createExportWrapper('FPDFAnnot_RemoveInkList'));
    var _FPDFAnnot_AppendObject = (Module['_FPDFAnnot_AppendObject'] = createExportWrapper('FPDFAnnot_AppendObject'));
    var _FPDFAnnot_GetObjectCount = (Module['_FPDFAnnot_GetObjectCount'] =
      createExportWrapper('FPDFAnnot_GetObjectCount'));
    var _FPDFAnnot_GetObject = (Module['_FPDFAnnot_GetObject'] = createExportWrapper('FPDFAnnot_GetObject'));
    var _FPDFAnnot_RemoveObject = (Module['_FPDFAnnot_RemoveObject'] = createExportWrapper('FPDFAnnot_RemoveObject'));
    var _FPDFAnnot_SetColor = (Module['_FPDFAnnot_SetColor'] = createExportWrapper('FPDFAnnot_SetColor'));
    var _FPDFAnnot_GetColor = (Module['_FPDFAnnot_GetColor'] = createExportWrapper('FPDFAnnot_GetColor'));
    var _FPDFAnnot_HasAttachmentPoints = (Module['_FPDFAnnot_HasAttachmentPoints'] = createExportWrapper(
      'FPDFAnnot_HasAttachmentPoints'
    ));
    var _FPDFAnnot_SetAttachmentPoints = (Module['_FPDFAnnot_SetAttachmentPoints'] = createExportWrapper(
      'FPDFAnnot_SetAttachmentPoints'
    ));
    var _FPDFAnnot_AppendAttachmentPoints = (Module['_FPDFAnnot_AppendAttachmentPoints'] = createExportWrapper(
      'FPDFAnnot_AppendAttachmentPoints'
    ));
    var _FPDFAnnot_CountAttachmentPoints = (Module['_FPDFAnnot_CountAttachmentPoints'] = createExportWrapper(
      'FPDFAnnot_CountAttachmentPoints'
    ));
    var _FPDFAnnot_GetAttachmentPoints = (Module['_FPDFAnnot_GetAttachmentPoints'] = createExportWrapper(
      'FPDFAnnot_GetAttachmentPoints'
    ));
    var _FPDFAnnot_SetRect = (Module['_FPDFAnnot_SetRect'] = createExportWrapper('FPDFAnnot_SetRect'));
    var _FPDFAnnot_GetRect = (Module['_FPDFAnnot_GetRect'] = createExportWrapper('FPDFAnnot_GetRect'));
    var _FPDFAnnot_GetVertices = (Module['_FPDFAnnot_GetVertices'] = createExportWrapper('FPDFAnnot_GetVertices'));
    var _FPDFAnnot_GetInkListCount = (Module['_FPDFAnnot_GetInkListCount'] =
      createExportWrapper('FPDFAnnot_GetInkListCount'));
    var _FPDFAnnot_GetInkListPath = (Module['_FPDFAnnot_GetInkListPath'] =
      createExportWrapper('FPDFAnnot_GetInkListPath'));
    var _FPDFAnnot_GetLine = (Module['_FPDFAnnot_GetLine'] = createExportWrapper('FPDFAnnot_GetLine'));
    var _FPDFAnnot_SetBorder = (Module['_FPDFAnnot_SetBorder'] = createExportWrapper('FPDFAnnot_SetBorder'));
    var _FPDFAnnot_GetBorder = (Module['_FPDFAnnot_GetBorder'] = createExportWrapper('FPDFAnnot_GetBorder'));
    var _FPDFAnnot_HasKey = (Module['_FPDFAnnot_HasKey'] = createExportWrapper('FPDFAnnot_HasKey'));
    var _FPDFAnnot_GetValueType = (Module['_FPDFAnnot_GetValueType'] = createExportWrapper('FPDFAnnot_GetValueType'));
    var _FPDFAnnot_SetStringValue = (Module['_FPDFAnnot_SetStringValue'] =
      createExportWrapper('FPDFAnnot_SetStringValue'));
    var _FPDFAnnot_GetStringValue = (Module['_FPDFAnnot_GetStringValue'] =
      createExportWrapper('FPDFAnnot_GetStringValue'));
    var _FPDFAnnot_GetNumberValue = (Module['_FPDFAnnot_GetNumberValue'] =
      createExportWrapper('FPDFAnnot_GetNumberValue'));
    var _FPDFAnnot_SetAP = (Module['_FPDFAnnot_SetAP'] = createExportWrapper('FPDFAnnot_SetAP'));
    var _FPDFAnnot_GetAP = (Module['_FPDFAnnot_GetAP'] = createExportWrapper('FPDFAnnot_GetAP'));
    var _FPDFAnnot_GetLinkedAnnot = (Module['_FPDFAnnot_GetLinkedAnnot'] =
      createExportWrapper('FPDFAnnot_GetLinkedAnnot'));
    var _FPDFAnnot_GetFlags = (Module['_FPDFAnnot_GetFlags'] = createExportWrapper('FPDFAnnot_GetFlags'));
    var _FPDFAnnot_SetFlags = (Module['_FPDFAnnot_SetFlags'] = createExportWrapper('FPDFAnnot_SetFlags'));
    var _FPDFAnnot_GetFormFieldFlags = (Module['_FPDFAnnot_GetFormFieldFlags'] =
      createExportWrapper('FPDFAnnot_GetFormFieldFlags'));
    var _FPDFAnnot_GetFormFieldAtPoint = (Module['_FPDFAnnot_GetFormFieldAtPoint'] = createExportWrapper(
      'FPDFAnnot_GetFormFieldAtPoint'
    ));
    var _FPDFAnnot_GetFormFieldName = (Module['_FPDFAnnot_GetFormFieldName'] =
      createExportWrapper('FPDFAnnot_GetFormFieldName'));
    var _FPDFAnnot_GetFormFieldType = (Module['_FPDFAnnot_GetFormFieldType'] =
      createExportWrapper('FPDFAnnot_GetFormFieldType'));
    var _FPDFAnnot_GetFormAdditionalActionJavaScript = (Module['_FPDFAnnot_GetFormAdditionalActionJavaScript'] =
      createExportWrapper('FPDFAnnot_GetFormAdditionalActionJavaScript'));
    var _FPDFAnnot_GetFormFieldAlternateName = (Module['_FPDFAnnot_GetFormFieldAlternateName'] = createExportWrapper(
      'FPDFAnnot_GetFormFieldAlternateName'
    ));
    var _FPDFAnnot_GetFormFieldValue = (Module['_FPDFAnnot_GetFormFieldValue'] =
      createExportWrapper('FPDFAnnot_GetFormFieldValue'));
    var _FPDFAnnot_GetOptionCount = (Module['_FPDFAnnot_GetOptionCount'] =
      createExportWrapper('FPDFAnnot_GetOptionCount'));
    var _FPDFAnnot_GetOptionLabel = (Module['_FPDFAnnot_GetOptionLabel'] =
      createExportWrapper('FPDFAnnot_GetOptionLabel'));
    var _FPDFAnnot_IsOptionSelected = (Module['_FPDFAnnot_IsOptionSelected'] =
      createExportWrapper('FPDFAnnot_IsOptionSelected'));
    var _FPDFAnnot_GetFontSize = (Module['_FPDFAnnot_GetFontSize'] = createExportWrapper('FPDFAnnot_GetFontSize'));
    var _FPDFAnnot_IsChecked = (Module['_FPDFAnnot_IsChecked'] = createExportWrapper('FPDFAnnot_IsChecked'));
    var _FPDFAnnot_SetFocusableSubtypes = (Module['_FPDFAnnot_SetFocusableSubtypes'] = createExportWrapper(
      'FPDFAnnot_SetFocusableSubtypes'
    ));
    var _FPDFAnnot_GetFocusableSubtypesCount = (Module['_FPDFAnnot_GetFocusableSubtypesCount'] = createExportWrapper(
      'FPDFAnnot_GetFocusableSubtypesCount'
    ));
    var _FPDFAnnot_GetFocusableSubtypes = (Module['_FPDFAnnot_GetFocusableSubtypes'] = createExportWrapper(
      'FPDFAnnot_GetFocusableSubtypes'
    ));
    var _FPDFAnnot_GetLink = (Module['_FPDFAnnot_GetLink'] = createExportWrapper('FPDFAnnot_GetLink'));
    var _FPDFAnnot_GetFormControlCount = (Module['_FPDFAnnot_GetFormControlCount'] = createExportWrapper(
      'FPDFAnnot_GetFormControlCount'
    ));
    var _FPDFAnnot_GetFormControlIndex = (Module['_FPDFAnnot_GetFormControlIndex'] = createExportWrapper(
      'FPDFAnnot_GetFormControlIndex'
    ));
    var _FPDFAnnot_GetFormFieldExportValue = (Module['_FPDFAnnot_GetFormFieldExportValue'] = createExportWrapper(
      'FPDFAnnot_GetFormFieldExportValue'
    ));
    var _FPDFAnnot_SetURI = (Module['_FPDFAnnot_SetURI'] = createExportWrapper('FPDFAnnot_SetURI'));
    var _FPDFDoc_GetAttachmentCount = (Module['_FPDFDoc_GetAttachmentCount'] =
      createExportWrapper('FPDFDoc_GetAttachmentCount'));
    var _FPDFDoc_AddAttachment = (Module['_FPDFDoc_AddAttachment'] = createExportWrapper('FPDFDoc_AddAttachment'));
    var _FPDFDoc_GetAttachment = (Module['_FPDFDoc_GetAttachment'] = createExportWrapper('FPDFDoc_GetAttachment'));
    var _FPDFDoc_DeleteAttachment = (Module['_FPDFDoc_DeleteAttachment'] =
      createExportWrapper('FPDFDoc_DeleteAttachment'));
    var _FPDFAttachment_GetName = (Module['_FPDFAttachment_GetName'] = createExportWrapper('FPDFAttachment_GetName'));
    var _FPDFAttachment_HasKey = (Module['_FPDFAttachment_HasKey'] = createExportWrapper('FPDFAttachment_HasKey'));
    var _FPDFAttachment_GetValueType = (Module['_FPDFAttachment_GetValueType'] =
      createExportWrapper('FPDFAttachment_GetValueType'));
    var _FPDFAttachment_SetStringValue = (Module['_FPDFAttachment_SetStringValue'] = createExportWrapper(
      'FPDFAttachment_SetStringValue'
    ));
    var _FPDFAttachment_GetStringValue = (Module['_FPDFAttachment_GetStringValue'] = createExportWrapper(
      'FPDFAttachment_GetStringValue'
    ));
    var _FPDFAttachment_SetFile = (Module['_FPDFAttachment_SetFile'] = createExportWrapper('FPDFAttachment_SetFile'));
    var _FPDFAttachment_GetFile = (Module['_FPDFAttachment_GetFile'] = createExportWrapper('FPDFAttachment_GetFile'));
    var _FPDFCatalog_IsTagged = (Module['_FPDFCatalog_IsTagged'] = createExportWrapper('FPDFCatalog_IsTagged'));
    var _FPDFAvail_Create = (Module['_FPDFAvail_Create'] = createExportWrapper('FPDFAvail_Create'));
    var _FPDFAvail_Destroy = (Module['_FPDFAvail_Destroy'] = createExportWrapper('FPDFAvail_Destroy'));
    var _FPDFAvail_IsDocAvail = (Module['_FPDFAvail_IsDocAvail'] = createExportWrapper('FPDFAvail_IsDocAvail'));
    var _FPDFAvail_GetDocument = (Module['_FPDFAvail_GetDocument'] = createExportWrapper('FPDFAvail_GetDocument'));
    var _FPDFAvail_GetFirstPageNum = (Module['_FPDFAvail_GetFirstPageNum'] =
      createExportWrapper('FPDFAvail_GetFirstPageNum'));
    var _FPDFAvail_IsPageAvail = (Module['_FPDFAvail_IsPageAvail'] = createExportWrapper('FPDFAvail_IsPageAvail'));
    var _FPDFAvail_IsFormAvail = (Module['_FPDFAvail_IsFormAvail'] = createExportWrapper('FPDFAvail_IsFormAvail'));
    var _FPDFAvail_IsLinearized = (Module['_FPDFAvail_IsLinearized'] = createExportWrapper('FPDFAvail_IsLinearized'));
    var _FPDFBookmark_GetFirstChild = (Module['_FPDFBookmark_GetFirstChild'] =
      createExportWrapper('FPDFBookmark_GetFirstChild'));
    var _FPDFBookmark_GetNextSibling = (Module['_FPDFBookmark_GetNextSibling'] =
      createExportWrapper('FPDFBookmark_GetNextSibling'));
    var _FPDFBookmark_GetTitle = (Module['_FPDFBookmark_GetTitle'] = createExportWrapper('FPDFBookmark_GetTitle'));
    var _FPDFBookmark_GetCount = (Module['_FPDFBookmark_GetCount'] = createExportWrapper('FPDFBookmark_GetCount'));
    var _FPDFBookmark_Find = (Module['_FPDFBookmark_Find'] = createExportWrapper('FPDFBookmark_Find'));
    var _FPDFBookmark_GetDest = (Module['_FPDFBookmark_GetDest'] = createExportWrapper('FPDFBookmark_GetDest'));
    var _FPDFBookmark_GetAction = (Module['_FPDFBookmark_GetAction'] = createExportWrapper('FPDFBookmark_GetAction'));
    var _FPDFAction_GetType = (Module['_FPDFAction_GetType'] = createExportWrapper('FPDFAction_GetType'));
    var _FPDFAction_GetDest = (Module['_FPDFAction_GetDest'] = createExportWrapper('FPDFAction_GetDest'));
    var _FPDFAction_GetFilePath = (Module['_FPDFAction_GetFilePath'] = createExportWrapper('FPDFAction_GetFilePath'));
    var _FPDFAction_GetURIPath = (Module['_FPDFAction_GetURIPath'] = createExportWrapper('FPDFAction_GetURIPath'));
    var _FPDFDest_GetDestPageIndex = (Module['_FPDFDest_GetDestPageIndex'] =
      createExportWrapper('FPDFDest_GetDestPageIndex'));
    var _FPDFDest_GetView = (Module['_FPDFDest_GetView'] = createExportWrapper('FPDFDest_GetView'));
    var _FPDFDest_GetLocationInPage = (Module['_FPDFDest_GetLocationInPage'] =
      createExportWrapper('FPDFDest_GetLocationInPage'));
    var _FPDFLink_GetLinkAtPoint = (Module['_FPDFLink_GetLinkAtPoint'] =
      createExportWrapper('FPDFLink_GetLinkAtPoint'));
    var _FPDFLink_GetLinkZOrderAtPoint = (Module['_FPDFLink_GetLinkZOrderAtPoint'] = createExportWrapper(
      'FPDFLink_GetLinkZOrderAtPoint'
    ));
    var _FPDFLink_GetDest = (Module['_FPDFLink_GetDest'] = createExportWrapper('FPDFLink_GetDest'));
    var _FPDFLink_GetAction = (Module['_FPDFLink_GetAction'] = createExportWrapper('FPDFLink_GetAction'));
    var _FPDFLink_Enumerate = (Module['_FPDFLink_Enumerate'] = createExportWrapper('FPDFLink_Enumerate'));
    var _FPDFLink_GetAnnot = (Module['_FPDFLink_GetAnnot'] = createExportWrapper('FPDFLink_GetAnnot'));
    var _FPDFLink_GetAnnotRect = (Module['_FPDFLink_GetAnnotRect'] = createExportWrapper('FPDFLink_GetAnnotRect'));
    var _FPDFLink_CountQuadPoints = (Module['_FPDFLink_CountQuadPoints'] =
      createExportWrapper('FPDFLink_CountQuadPoints'));
    var _FPDFLink_GetQuadPoints = (Module['_FPDFLink_GetQuadPoints'] = createExportWrapper('FPDFLink_GetQuadPoints'));
    var _FPDF_GetPageAAction = (Module['_FPDF_GetPageAAction'] = createExportWrapper('FPDF_GetPageAAction'));
    var _FPDF_GetFileIdentifier = (Module['_FPDF_GetFileIdentifier'] = createExportWrapper('FPDF_GetFileIdentifier'));
    var _FPDF_GetMetaText = (Module['_FPDF_GetMetaText'] = createExportWrapper('FPDF_GetMetaText'));
    var _FPDF_GetPageLabel = (Module['_FPDF_GetPageLabel'] = createExportWrapper('FPDF_GetPageLabel'));
    var _FPDFPageObj_NewImageObj = (Module['_FPDFPageObj_NewImageObj'] =
      createExportWrapper('FPDFPageObj_NewImageObj'));
    var _FPDFImageObj_LoadJpegFile = (Module['_FPDFImageObj_LoadJpegFile'] =
      createExportWrapper('FPDFImageObj_LoadJpegFile'));
    var _FPDFImageObj_LoadJpegFileInline = (Module['_FPDFImageObj_LoadJpegFileInline'] = createExportWrapper(
      'FPDFImageObj_LoadJpegFileInline'
    ));
    var _FPDFImageObj_SetMatrix = (Module['_FPDFImageObj_SetMatrix'] = createExportWrapper('FPDFImageObj_SetMatrix'));
    var _FPDFImageObj_SetBitmap = (Module['_FPDFImageObj_SetBitmap'] = createExportWrapper('FPDFImageObj_SetBitmap'));
    var _FPDFImageObj_GetBitmap = (Module['_FPDFImageObj_GetBitmap'] = createExportWrapper('FPDFImageObj_GetBitmap'));
    var _FPDFImageObj_GetRenderedBitmap = (Module['_FPDFImageObj_GetRenderedBitmap'] = createExportWrapper(
      'FPDFImageObj_GetRenderedBitmap'
    ));
    var _FPDFImageObj_GetImageDataDecoded = (Module['_FPDFImageObj_GetImageDataDecoded'] = createExportWrapper(
      'FPDFImageObj_GetImageDataDecoded'
    ));
    var _FPDFImageObj_GetImageDataRaw = (Module['_FPDFImageObj_GetImageDataRaw'] =
      createExportWrapper('FPDFImageObj_GetImageDataRaw'));
    var _FPDFImageObj_GetImageFilterCount = (Module['_FPDFImageObj_GetImageFilterCount'] = createExportWrapper(
      'FPDFImageObj_GetImageFilterCount'
    ));
    var _FPDFImageObj_GetImageFilter = (Module['_FPDFImageObj_GetImageFilter'] =
      createExportWrapper('FPDFImageObj_GetImageFilter'));
    var _FPDFImageObj_GetImageMetadata = (Module['_FPDFImageObj_GetImageMetadata'] = createExportWrapper(
      'FPDFImageObj_GetImageMetadata'
    ));
    var _FPDFImageObj_GetImagePixelSize = (Module['_FPDFImageObj_GetImagePixelSize'] = createExportWrapper(
      'FPDFImageObj_GetImagePixelSize'
    ));
    var _FPDF_CreateNewDocument = (Module['_FPDF_CreateNewDocument'] = createExportWrapper('FPDF_CreateNewDocument'));
    var _FPDFPage_Delete = (Module['_FPDFPage_Delete'] = createExportWrapper('FPDFPage_Delete'));
    var _FPDF_MovePages = (Module['_FPDF_MovePages'] = createExportWrapper('FPDF_MovePages'));
    var _FPDFPage_New = (Module['_FPDFPage_New'] = createExportWrapper('FPDFPage_New'));
    var _FPDFPage_GetRotation = (Module['_FPDFPage_GetRotation'] = createExportWrapper('FPDFPage_GetRotation'));
    var _FPDFPage_InsertObject = (Module['_FPDFPage_InsertObject'] = createExportWrapper('FPDFPage_InsertObject'));
    var _FPDFPage_RemoveObject = (Module['_FPDFPage_RemoveObject'] = createExportWrapper('FPDFPage_RemoveObject'));
    var _FPDFPage_CountObjects = (Module['_FPDFPage_CountObjects'] = createExportWrapper('FPDFPage_CountObjects'));
    var _FPDFPage_GetObject = (Module['_FPDFPage_GetObject'] = createExportWrapper('FPDFPage_GetObject'));
    var _FPDFPage_HasTransparency = (Module['_FPDFPage_HasTransparency'] =
      createExportWrapper('FPDFPage_HasTransparency'));
    var _FPDFPageObj_Destroy = (Module['_FPDFPageObj_Destroy'] = createExportWrapper('FPDFPageObj_Destroy'));
    var _FPDFPageObj_CountMarks = (Module['_FPDFPageObj_CountMarks'] = createExportWrapper('FPDFPageObj_CountMarks'));
    var _FPDFPageObj_GetMark = (Module['_FPDFPageObj_GetMark'] = createExportWrapper('FPDFPageObj_GetMark'));
    var _FPDFPageObj_AddMark = (Module['_FPDFPageObj_AddMark'] = createExportWrapper('FPDFPageObj_AddMark'));
    var _FPDFPageObj_RemoveMark = (Module['_FPDFPageObj_RemoveMark'] = createExportWrapper('FPDFPageObj_RemoveMark'));
    var _FPDFPageObjMark_GetName = (Module['_FPDFPageObjMark_GetName'] =
      createExportWrapper('FPDFPageObjMark_GetName'));
    var _FPDFPageObjMark_CountParams = (Module['_FPDFPageObjMark_CountParams'] =
      createExportWrapper('FPDFPageObjMark_CountParams'));
    var _FPDFPageObjMark_GetParamKey = (Module['_FPDFPageObjMark_GetParamKey'] =
      createExportWrapper('FPDFPageObjMark_GetParamKey'));
    var _FPDFPageObjMark_GetParamValueType = (Module['_FPDFPageObjMark_GetParamValueType'] = createExportWrapper(
      'FPDFPageObjMark_GetParamValueType'
    ));
    var _FPDFPageObjMark_GetParamIntValue = (Module['_FPDFPageObjMark_GetParamIntValue'] = createExportWrapper(
      'FPDFPageObjMark_GetParamIntValue'
    ));
    var _FPDFPageObjMark_GetParamStringValue = (Module['_FPDFPageObjMark_GetParamStringValue'] = createExportWrapper(
      'FPDFPageObjMark_GetParamStringValue'
    ));
    var _FPDFPageObjMark_GetParamBlobValue = (Module['_FPDFPageObjMark_GetParamBlobValue'] = createExportWrapper(
      'FPDFPageObjMark_GetParamBlobValue'
    ));
    var _FPDFPageObj_HasTransparency = (Module['_FPDFPageObj_HasTransparency'] =
      createExportWrapper('FPDFPageObj_HasTransparency'));
    var _FPDFPageObjMark_SetIntParam = (Module['_FPDFPageObjMark_SetIntParam'] =
      createExportWrapper('FPDFPageObjMark_SetIntParam'));
    var _FPDFPageObjMark_SetStringParam = (Module['_FPDFPageObjMark_SetStringParam'] = createExportWrapper(
      'FPDFPageObjMark_SetStringParam'
    ));
    var _FPDFPageObjMark_SetBlobParam = (Module['_FPDFPageObjMark_SetBlobParam'] =
      createExportWrapper('FPDFPageObjMark_SetBlobParam'));
    var _FPDFPageObjMark_RemoveParam = (Module['_FPDFPageObjMark_RemoveParam'] =
      createExportWrapper('FPDFPageObjMark_RemoveParam'));
    var _FPDFPageObj_GetType = (Module['_FPDFPageObj_GetType'] = createExportWrapper('FPDFPageObj_GetType'));
    var _FPDFPage_GenerateContent = (Module['_FPDFPage_GenerateContent'] =
      createExportWrapper('FPDFPage_GenerateContent'));
    var _FPDFPageObj_Transform = (Module['_FPDFPageObj_Transform'] = createExportWrapper('FPDFPageObj_Transform'));
    var _FPDFPageObj_GetMatrix = (Module['_FPDFPageObj_GetMatrix'] = createExportWrapper('FPDFPageObj_GetMatrix'));
    var _FPDFPageObj_SetMatrix = (Module['_FPDFPageObj_SetMatrix'] = createExportWrapper('FPDFPageObj_SetMatrix'));
    var _FPDFPageObj_SetBlendMode = (Module['_FPDFPageObj_SetBlendMode'] =
      createExportWrapper('FPDFPageObj_SetBlendMode'));
    var _FPDFPage_TransformAnnots = (Module['_FPDFPage_TransformAnnots'] =
      createExportWrapper('FPDFPage_TransformAnnots'));
    var _FPDFPage_SetRotation = (Module['_FPDFPage_SetRotation'] = createExportWrapper('FPDFPage_SetRotation'));
    var _FPDFPageObj_SetFillColor = (Module['_FPDFPageObj_SetFillColor'] =
      createExportWrapper('FPDFPageObj_SetFillColor'));
    var _FPDFPageObj_GetFillColor = (Module['_FPDFPageObj_GetFillColor'] =
      createExportWrapper('FPDFPageObj_GetFillColor'));
    var _FPDFPageObj_GetBounds = (Module['_FPDFPageObj_GetBounds'] = createExportWrapper('FPDFPageObj_GetBounds'));
    var _FPDFPageObj_GetRotatedBounds = (Module['_FPDFPageObj_GetRotatedBounds'] =
      createExportWrapper('FPDFPageObj_GetRotatedBounds'));
    var _FPDFPageObj_SetStrokeColor = (Module['_FPDFPageObj_SetStrokeColor'] =
      createExportWrapper('FPDFPageObj_SetStrokeColor'));
    var _FPDFPageObj_GetStrokeColor = (Module['_FPDFPageObj_GetStrokeColor'] =
      createExportWrapper('FPDFPageObj_GetStrokeColor'));
    var _FPDFPageObj_SetStrokeWidth = (Module['_FPDFPageObj_SetStrokeWidth'] =
      createExportWrapper('FPDFPageObj_SetStrokeWidth'));
    var _FPDFPageObj_GetStrokeWidth = (Module['_FPDFPageObj_GetStrokeWidth'] =
      createExportWrapper('FPDFPageObj_GetStrokeWidth'));
    var _FPDFPageObj_GetLineJoin = (Module['_FPDFPageObj_GetLineJoin'] =
      createExportWrapper('FPDFPageObj_GetLineJoin'));
    var _FPDFPageObj_SetLineJoin = (Module['_FPDFPageObj_SetLineJoin'] =
      createExportWrapper('FPDFPageObj_SetLineJoin'));
    var _FPDFPageObj_GetLineCap = (Module['_FPDFPageObj_GetLineCap'] = createExportWrapper('FPDFPageObj_GetLineCap'));
    var _FPDFPageObj_SetLineCap = (Module['_FPDFPageObj_SetLineCap'] = createExportWrapper('FPDFPageObj_SetLineCap'));
    var _FPDFPageObj_GetDashPhase = (Module['_FPDFPageObj_GetDashPhase'] =
      createExportWrapper('FPDFPageObj_GetDashPhase'));
    var _FPDFPageObj_SetDashPhase = (Module['_FPDFPageObj_SetDashPhase'] =
      createExportWrapper('FPDFPageObj_SetDashPhase'));
    var _FPDFPageObj_GetDashCount = (Module['_FPDFPageObj_GetDashCount'] =
      createExportWrapper('FPDFPageObj_GetDashCount'));
    var _FPDFPageObj_GetDashArray = (Module['_FPDFPageObj_GetDashArray'] =
      createExportWrapper('FPDFPageObj_GetDashArray'));
    var _FPDFPageObj_SetDashArray = (Module['_FPDFPageObj_SetDashArray'] =
      createExportWrapper('FPDFPageObj_SetDashArray'));
    var _FPDFFormObj_CountObjects = (Module['_FPDFFormObj_CountObjects'] =
      createExportWrapper('FPDFFormObj_CountObjects'));
    var _FPDFFormObj_GetObject = (Module['_FPDFFormObj_GetObject'] = createExportWrapper('FPDFFormObj_GetObject'));
    var _FPDFPageObj_CreateNewPath = (Module['_FPDFPageObj_CreateNewPath'] =
      createExportWrapper('FPDFPageObj_CreateNewPath'));
    var _FPDFPageObj_CreateNewRect = (Module['_FPDFPageObj_CreateNewRect'] =
      createExportWrapper('FPDFPageObj_CreateNewRect'));
    var _FPDFPath_CountSegments = (Module['_FPDFPath_CountSegments'] = createExportWrapper('FPDFPath_CountSegments'));
    var _FPDFPath_GetPathSegment = (Module['_FPDFPath_GetPathSegment'] =
      createExportWrapper('FPDFPath_GetPathSegment'));
    var _FPDFPath_MoveTo = (Module['_FPDFPath_MoveTo'] = createExportWrapper('FPDFPath_MoveTo'));
    var _FPDFPath_LineTo = (Module['_FPDFPath_LineTo'] = createExportWrapper('FPDFPath_LineTo'));
    var _FPDFPath_BezierTo = (Module['_FPDFPath_BezierTo'] = createExportWrapper('FPDFPath_BezierTo'));
    var _FPDFPath_Close = (Module['_FPDFPath_Close'] = createExportWrapper('FPDFPath_Close'));
    var _FPDFPath_SetDrawMode = (Module['_FPDFPath_SetDrawMode'] = createExportWrapper('FPDFPath_SetDrawMode'));
    var _FPDFPath_GetDrawMode = (Module['_FPDFPath_GetDrawMode'] = createExportWrapper('FPDFPath_GetDrawMode'));
    var _FPDFPathSegment_GetPoint = (Module['_FPDFPathSegment_GetPoint'] =
      createExportWrapper('FPDFPathSegment_GetPoint'));
    var _FPDFPathSegment_GetType = (Module['_FPDFPathSegment_GetType'] =
      createExportWrapper('FPDFPathSegment_GetType'));
    var _FPDFPathSegment_GetClose = (Module['_FPDFPathSegment_GetClose'] =
      createExportWrapper('FPDFPathSegment_GetClose'));
    var _FPDFPageObj_NewTextObj = (Module['_FPDFPageObj_NewTextObj'] = createExportWrapper('FPDFPageObj_NewTextObj'));
    var _FPDFText_SetText = (Module['_FPDFText_SetText'] = createExportWrapper('FPDFText_SetText'));
    var _FPDFText_SetCharcodes = (Module['_FPDFText_SetCharcodes'] = createExportWrapper('FPDFText_SetCharcodes'));
    var _FPDFText_LoadFont = (Module['_FPDFText_LoadFont'] = createExportWrapper('FPDFText_LoadFont'));
    var _FPDFText_LoadStandardFont = (Module['_FPDFText_LoadStandardFont'] =
      createExportWrapper('FPDFText_LoadStandardFont'));
    var _FPDFTextObj_GetFontSize = (Module['_FPDFTextObj_GetFontSize'] =
      createExportWrapper('FPDFTextObj_GetFontSize'));
    var _FPDFTextObj_GetText = (Module['_FPDFTextObj_GetText'] = createExportWrapper('FPDFTextObj_GetText'));
    var _FPDFTextObj_GetRenderedBitmap = (Module['_FPDFTextObj_GetRenderedBitmap'] = createExportWrapper(
      'FPDFTextObj_GetRenderedBitmap'
    ));
    var _FPDFFont_Close = (Module['_FPDFFont_Close'] = createExportWrapper('FPDFFont_Close'));
    var _FPDFPageObj_CreateTextObj = (Module['_FPDFPageObj_CreateTextObj'] =
      createExportWrapper('FPDFPageObj_CreateTextObj'));
    var _FPDFTextObj_GetTextRenderMode = (Module['_FPDFTextObj_GetTextRenderMode'] = createExportWrapper(
      'FPDFTextObj_GetTextRenderMode'
    ));
    var _FPDFTextObj_SetTextRenderMode = (Module['_FPDFTextObj_SetTextRenderMode'] = createExportWrapper(
      'FPDFTextObj_SetTextRenderMode'
    ));
    var _FPDFTextObj_GetFont = (Module['_FPDFTextObj_GetFont'] = createExportWrapper('FPDFTextObj_GetFont'));
    var _FPDFFont_GetFontName = (Module['_FPDFFont_GetFontName'] = createExportWrapper('FPDFFont_GetFontName'));
    var _FPDFFont_GetFontData = (Module['_FPDFFont_GetFontData'] = createExportWrapper('FPDFFont_GetFontData'));
    var _FPDFFont_GetIsEmbedded = (Module['_FPDFFont_GetIsEmbedded'] = createExportWrapper('FPDFFont_GetIsEmbedded'));
    var _FPDFFont_GetFlags = (Module['_FPDFFont_GetFlags'] = createExportWrapper('FPDFFont_GetFlags'));
    var _FPDFFont_GetWeight = (Module['_FPDFFont_GetWeight'] = createExportWrapper('FPDFFont_GetWeight'));
    var _FPDFFont_GetItalicAngle = (Module['_FPDFFont_GetItalicAngle'] =
      createExportWrapper('FPDFFont_GetItalicAngle'));
    var _FPDFFont_GetAscent = (Module['_FPDFFont_GetAscent'] = createExportWrapper('FPDFFont_GetAscent'));
    var _FPDFFont_GetDescent = (Module['_FPDFFont_GetDescent'] = createExportWrapper('FPDFFont_GetDescent'));
    var _FPDFFont_GetGlyphWidth = (Module['_FPDFFont_GetGlyphWidth'] = createExportWrapper('FPDFFont_GetGlyphWidth'));
    var _FPDFFont_GetGlyphPath = (Module['_FPDFFont_GetGlyphPath'] = createExportWrapper('FPDFFont_GetGlyphPath'));
    var _FPDFGlyphPath_CountGlyphSegments = (Module['_FPDFGlyphPath_CountGlyphSegments'] = createExportWrapper(
      'FPDFGlyphPath_CountGlyphSegments'
    ));
    var _FPDFGlyphPath_GetGlyphPathSegment = (Module['_FPDFGlyphPath_GetGlyphPathSegment'] = createExportWrapper(
      'FPDFGlyphPath_GetGlyphPathSegment'
    ));
    var _FSDK_SetUnSpObjProcessHandler = (Module['_FSDK_SetUnSpObjProcessHandler'] = createExportWrapper(
      'FSDK_SetUnSpObjProcessHandler'
    ));
    var _FSDK_SetTimeFunction = (Module['_FSDK_SetTimeFunction'] = createExportWrapper('FSDK_SetTimeFunction'));
    var _FSDK_SetLocaltimeFunction = (Module['_FSDK_SetLocaltimeFunction'] =
      createExportWrapper('FSDK_SetLocaltimeFunction'));
    var _FPDFDoc_GetPageMode = (Module['_FPDFDoc_GetPageMode'] = createExportWrapper('FPDFDoc_GetPageMode'));
    var _FPDFPage_Flatten = (Module['_FPDFPage_Flatten'] = createExportWrapper('FPDFPage_Flatten'));
    var _FPDFPage_HasFormFieldAtPoint = (Module['_FPDFPage_HasFormFieldAtPoint'] =
      createExportWrapper('FPDFPage_HasFormFieldAtPoint'));
    var _FPDFPage_FormFieldZOrderAtPoint = (Module['_FPDFPage_FormFieldZOrderAtPoint'] = createExportWrapper(
      'FPDFPage_FormFieldZOrderAtPoint'
    ));
    var _FPDFDOC_InitFormFillEnvironment = (Module['_FPDFDOC_InitFormFillEnvironment'] = createExportWrapper(
      'FPDFDOC_InitFormFillEnvironment'
    ));
    var _FPDFDOC_ExitFormFillEnvironment = (Module['_FPDFDOC_ExitFormFillEnvironment'] = createExportWrapper(
      'FPDFDOC_ExitFormFillEnvironment'
    ));
    var _FORM_OnMouseMove = (Module['_FORM_OnMouseMove'] = createExportWrapper('FORM_OnMouseMove'));
    var _FORM_OnMouseWheel = (Module['_FORM_OnMouseWheel'] = createExportWrapper('FORM_OnMouseWheel'));
    var _FORM_OnFocus = (Module['_FORM_OnFocus'] = createExportWrapper('FORM_OnFocus'));
    var _FORM_OnLButtonDown = (Module['_FORM_OnLButtonDown'] = createExportWrapper('FORM_OnLButtonDown'));
    var _FORM_OnLButtonUp = (Module['_FORM_OnLButtonUp'] = createExportWrapper('FORM_OnLButtonUp'));
    var _FORM_OnLButtonDoubleClick = (Module['_FORM_OnLButtonDoubleClick'] =
      createExportWrapper('FORM_OnLButtonDoubleClick'));
    var _FORM_OnRButtonDown = (Module['_FORM_OnRButtonDown'] = createExportWrapper('FORM_OnRButtonDown'));
    var _FORM_OnRButtonUp = (Module['_FORM_OnRButtonUp'] = createExportWrapper('FORM_OnRButtonUp'));
    var _FORM_OnKeyDown = (Module['_FORM_OnKeyDown'] = createExportWrapper('FORM_OnKeyDown'));
    var _FORM_OnKeyUp = (Module['_FORM_OnKeyUp'] = createExportWrapper('FORM_OnKeyUp'));
    var _FORM_OnChar = (Module['_FORM_OnChar'] = createExportWrapper('FORM_OnChar'));
    var _FORM_GetFocusedText = (Module['_FORM_GetFocusedText'] = createExportWrapper('FORM_GetFocusedText'));
    var _FORM_GetSelectedText = (Module['_FORM_GetSelectedText'] = createExportWrapper('FORM_GetSelectedText'));
    var _FORM_ReplaceAndKeepSelection = (Module['_FORM_ReplaceAndKeepSelection'] =
      createExportWrapper('FORM_ReplaceAndKeepSelection'));
    var _FORM_ReplaceSelection = (Module['_FORM_ReplaceSelection'] = createExportWrapper('FORM_ReplaceSelection'));
    var _FORM_SelectAllText = (Module['_FORM_SelectAllText'] = createExportWrapper('FORM_SelectAllText'));
    var _FORM_CanUndo = (Module['_FORM_CanUndo'] = createExportWrapper('FORM_CanUndo'));
    var _FORM_CanRedo = (Module['_FORM_CanRedo'] = createExportWrapper('FORM_CanRedo'));
    var _FORM_Undo = (Module['_FORM_Undo'] = createExportWrapper('FORM_Undo'));
    var _FORM_Redo = (Module['_FORM_Redo'] = createExportWrapper('FORM_Redo'));
    var _FORM_ForceToKillFocus = (Module['_FORM_ForceToKillFocus'] = createExportWrapper('FORM_ForceToKillFocus'));
    var _FORM_GetFocusedAnnot = (Module['_FORM_GetFocusedAnnot'] = createExportWrapper('FORM_GetFocusedAnnot'));
    var _FORM_SetFocusedAnnot = (Module['_FORM_SetFocusedAnnot'] = createExportWrapper('FORM_SetFocusedAnnot'));
    var _FPDF_FFLDraw = (Module['_FPDF_FFLDraw'] = createExportWrapper('FPDF_FFLDraw'));
    var _FPDF_SetFormFieldHighlightColor = (Module['_FPDF_SetFormFieldHighlightColor'] = createExportWrapper(
      'FPDF_SetFormFieldHighlightColor'
    ));
    var _FPDF_SetFormFieldHighlightAlpha = (Module['_FPDF_SetFormFieldHighlightAlpha'] = createExportWrapper(
      'FPDF_SetFormFieldHighlightAlpha'
    ));
    var _FPDF_RemoveFormFieldHighlight = (Module['_FPDF_RemoveFormFieldHighlight'] = createExportWrapper(
      'FPDF_RemoveFormFieldHighlight'
    ));
    var _FORM_OnAfterLoadPage = (Module['_FORM_OnAfterLoadPage'] = createExportWrapper('FORM_OnAfterLoadPage'));
    var _FORM_OnBeforeClosePage = (Module['_FORM_OnBeforeClosePage'] = createExportWrapper('FORM_OnBeforeClosePage'));
    var _FORM_DoDocumentJSAction = (Module['_FORM_DoDocumentJSAction'] =
      createExportWrapper('FORM_DoDocumentJSAction'));
    var _FORM_DoDocumentOpenAction = (Module['_FORM_DoDocumentOpenAction'] =
      createExportWrapper('FORM_DoDocumentOpenAction'));
    var _FORM_DoDocumentAAction = (Module['_FORM_DoDocumentAAction'] = createExportWrapper('FORM_DoDocumentAAction'));
    var _FORM_DoPageAAction = (Module['_FORM_DoPageAAction'] = createExportWrapper('FORM_DoPageAAction'));
    var _FORM_SetIndexSelected = (Module['_FORM_SetIndexSelected'] = createExportWrapper('FORM_SetIndexSelected'));
    var _FORM_IsIndexSelected = (Module['_FORM_IsIndexSelected'] = createExportWrapper('FORM_IsIndexSelected'));
    var _FPDFDoc_GetJavaScriptActionCount = (Module['_FPDFDoc_GetJavaScriptActionCount'] = createExportWrapper(
      'FPDFDoc_GetJavaScriptActionCount'
    ));
    var _FPDFDoc_GetJavaScriptAction = (Module['_FPDFDoc_GetJavaScriptAction'] =
      createExportWrapper('FPDFDoc_GetJavaScriptAction'));
    var _FPDFDoc_CloseJavaScriptAction = (Module['_FPDFDoc_CloseJavaScriptAction'] = createExportWrapper(
      'FPDFDoc_CloseJavaScriptAction'
    ));
    var _FPDFJavaScriptAction_GetName = (Module['_FPDFJavaScriptAction_GetName'] =
      createExportWrapper('FPDFJavaScriptAction_GetName'));
    var _FPDFJavaScriptAction_GetScript = (Module['_FPDFJavaScriptAction_GetScript'] = createExportWrapper(
      'FPDFJavaScriptAction_GetScript'
    ));
    var _FPDF_ImportPagesByIndex = (Module['_FPDF_ImportPagesByIndex'] =
      createExportWrapper('FPDF_ImportPagesByIndex'));
    var _FPDF_ImportPages = (Module['_FPDF_ImportPages'] = createExportWrapper('FPDF_ImportPages'));
    var _FPDF_ImportNPagesToOne = (Module['_FPDF_ImportNPagesToOne'] = createExportWrapper('FPDF_ImportNPagesToOne'));
    var _FPDF_NewXObjectFromPage = (Module['_FPDF_NewXObjectFromPage'] =
      createExportWrapper('FPDF_NewXObjectFromPage'));
    var _FPDF_CloseXObject = (Module['_FPDF_CloseXObject'] = createExportWrapper('FPDF_CloseXObject'));
    var _FPDF_NewFormObjectFromXObject = (Module['_FPDF_NewFormObjectFromXObject'] = createExportWrapper(
      'FPDF_NewFormObjectFromXObject'
    ));
    var _FPDF_CopyViewerPreferences = (Module['_FPDF_CopyViewerPreferences'] =
      createExportWrapper('FPDF_CopyViewerPreferences'));
    var _FPDF_RenderPageBitmapWithColorScheme_Start = (Module['_FPDF_RenderPageBitmapWithColorScheme_Start'] =
      createExportWrapper('FPDF_RenderPageBitmapWithColorScheme_Start'));
    var _FPDF_RenderPageBitmap_Start = (Module['_FPDF_RenderPageBitmap_Start'] =
      createExportWrapper('FPDF_RenderPageBitmap_Start'));
    var _FPDF_RenderPage_Continue = (Module['_FPDF_RenderPage_Continue'] =
      createExportWrapper('FPDF_RenderPage_Continue'));
    var _FPDF_RenderPage_Close = (Module['_FPDF_RenderPage_Close'] = createExportWrapper('FPDF_RenderPage_Close'));
    var _FPDF_SaveAsCopy = (Module['_FPDF_SaveAsCopy'] = createExportWrapper('FPDF_SaveAsCopy'));
    var _FPDF_SaveWithVersion = (Module['_FPDF_SaveWithVersion'] = createExportWrapper('FPDF_SaveWithVersion'));
    var _FPDFText_GetCharIndexFromTextIndex = (Module['_FPDFText_GetCharIndexFromTextIndex'] = createExportWrapper(
      'FPDFText_GetCharIndexFromTextIndex'
    ));
    var _FPDFText_GetTextIndexFromCharIndex = (Module['_FPDFText_GetTextIndexFromCharIndex'] = createExportWrapper(
      'FPDFText_GetTextIndexFromCharIndex'
    ));
    var _FPDF_GetSignatureCount = (Module['_FPDF_GetSignatureCount'] = createExportWrapper('FPDF_GetSignatureCount'));
    var _FPDF_GetSignatureObject = (Module['_FPDF_GetSignatureObject'] =
      createExportWrapper('FPDF_GetSignatureObject'));
    var _FPDFSignatureObj_GetContents = (Module['_FPDFSignatureObj_GetContents'] =
      createExportWrapper('FPDFSignatureObj_GetContents'));
    var _FPDFSignatureObj_GetByteRange = (Module['_FPDFSignatureObj_GetByteRange'] = createExportWrapper(
      'FPDFSignatureObj_GetByteRange'
    ));
    var _FPDFSignatureObj_GetSubFilter = (Module['_FPDFSignatureObj_GetSubFilter'] = createExportWrapper(
      'FPDFSignatureObj_GetSubFilter'
    ));
    var _FPDFSignatureObj_GetReason = (Module['_FPDFSignatureObj_GetReason'] =
      createExportWrapper('FPDFSignatureObj_GetReason'));
    var _FPDFSignatureObj_GetTime = (Module['_FPDFSignatureObj_GetTime'] =
      createExportWrapper('FPDFSignatureObj_GetTime'));
    var _FPDFSignatureObj_GetDocMDPPermission = (Module['_FPDFSignatureObj_GetDocMDPPermission'] = createExportWrapper(
      'FPDFSignatureObj_GetDocMDPPermission'
    ));
    var _FPDF_StructTree_GetForPage = (Module['_FPDF_StructTree_GetForPage'] =
      createExportWrapper('FPDF_StructTree_GetForPage'));
    var _FPDF_StructTree_Close = (Module['_FPDF_StructTree_Close'] = createExportWrapper('FPDF_StructTree_Close'));
    var _FPDF_StructTree_CountChildren = (Module['_FPDF_StructTree_CountChildren'] = createExportWrapper(
      'FPDF_StructTree_CountChildren'
    ));
    var _FPDF_StructTree_GetChildAtIndex = (Module['_FPDF_StructTree_GetChildAtIndex'] = createExportWrapper(
      'FPDF_StructTree_GetChildAtIndex'
    ));
    var _FPDF_StructElement_GetAltText = (Module['_FPDF_StructElement_GetAltText'] = createExportWrapper(
      'FPDF_StructElement_GetAltText'
    ));
    var _FPDF_StructElement_GetActualText = (Module['_FPDF_StructElement_GetActualText'] = createExportWrapper(
      'FPDF_StructElement_GetActualText'
    ));
    var _FPDF_StructElement_GetID = (Module['_FPDF_StructElement_GetID'] =
      createExportWrapper('FPDF_StructElement_GetID'));
    var _FPDF_StructElement_GetLang = (Module['_FPDF_StructElement_GetLang'] =
      createExportWrapper('FPDF_StructElement_GetLang'));
    var _FPDF_StructElement_GetAttributeCount = (Module['_FPDF_StructElement_GetAttributeCount'] = createExportWrapper(
      'FPDF_StructElement_GetAttributeCount'
    ));
    var _FPDF_StructElement_GetAttributeAtIndex = (Module['_FPDF_StructElement_GetAttributeAtIndex'] =
      createExportWrapper('FPDF_StructElement_GetAttributeAtIndex'));
    var _FPDF_StructElement_GetStringAttribute = (Module['_FPDF_StructElement_GetStringAttribute'] =
      createExportWrapper('FPDF_StructElement_GetStringAttribute'));
    var _FPDF_StructElement_GetMarkedContentID = (Module['_FPDF_StructElement_GetMarkedContentID'] =
      createExportWrapper('FPDF_StructElement_GetMarkedContentID'));
    var _FPDF_StructElement_GetType = (Module['_FPDF_StructElement_GetType'] =
      createExportWrapper('FPDF_StructElement_GetType'));
    var _FPDF_StructElement_GetObjType = (Module['_FPDF_StructElement_GetObjType'] = createExportWrapper(
      'FPDF_StructElement_GetObjType'
    ));
    var _FPDF_StructElement_GetTitle = (Module['_FPDF_StructElement_GetTitle'] =
      createExportWrapper('FPDF_StructElement_GetTitle'));
    var _FPDF_StructElement_CountChildren = (Module['_FPDF_StructElement_CountChildren'] = createExportWrapper(
      'FPDF_StructElement_CountChildren'
    ));
    var _FPDF_StructElement_GetChildAtIndex = (Module['_FPDF_StructElement_GetChildAtIndex'] = createExportWrapper(
      'FPDF_StructElement_GetChildAtIndex'
    ));
    var _FPDF_StructElement_GetChildMarkedContentID = (Module['_FPDF_StructElement_GetChildMarkedContentID'] =
      createExportWrapper('FPDF_StructElement_GetChildMarkedContentID'));
    var _FPDF_StructElement_GetParent = (Module['_FPDF_StructElement_GetParent'] =
      createExportWrapper('FPDF_StructElement_GetParent'));
    var _FPDF_StructElement_Attr_GetCount = (Module['_FPDF_StructElement_Attr_GetCount'] = createExportWrapper(
      'FPDF_StructElement_Attr_GetCount'
    ));
    var _FPDF_StructElement_Attr_GetName = (Module['_FPDF_StructElement_Attr_GetName'] = createExportWrapper(
      'FPDF_StructElement_Attr_GetName'
    ));
    var _FPDF_StructElement_Attr_GetType = (Module['_FPDF_StructElement_Attr_GetType'] = createExportWrapper(
      'FPDF_StructElement_Attr_GetType'
    ));
    var _FPDF_StructElement_Attr_GetBooleanValue = (Module['_FPDF_StructElement_Attr_GetBooleanValue'] =
      createExportWrapper('FPDF_StructElement_Attr_GetBooleanValue'));
    var _FPDF_StructElement_Attr_GetNumberValue = (Module['_FPDF_StructElement_Attr_GetNumberValue'] =
      createExportWrapper('FPDF_StructElement_Attr_GetNumberValue'));
    var _FPDF_StructElement_Attr_GetStringValue = (Module['_FPDF_StructElement_Attr_GetStringValue'] =
      createExportWrapper('FPDF_StructElement_Attr_GetStringValue'));
    var _FPDF_StructElement_Attr_GetBlobValue = (Module['_FPDF_StructElement_Attr_GetBlobValue'] = createExportWrapper(
      'FPDF_StructElement_Attr_GetBlobValue'
    ));
    var _FPDF_StructElement_GetMarkedContentIdCount = (Module['_FPDF_StructElement_GetMarkedContentIdCount'] =
      createExportWrapper('FPDF_StructElement_GetMarkedContentIdCount'));
    var _FPDF_StructElement_GetMarkedContentIdAtIndex = (Module['_FPDF_StructElement_GetMarkedContentIdAtIndex'] =
      createExportWrapper('FPDF_StructElement_GetMarkedContentIdAtIndex'));
    var _FPDF_AddInstalledFont = (Module['_FPDF_AddInstalledFont'] = createExportWrapper('FPDF_AddInstalledFont'));
    var _FPDF_SetSystemFontInfo = (Module['_FPDF_SetSystemFontInfo'] = createExportWrapper('FPDF_SetSystemFontInfo'));
    var _FPDF_GetDefaultTTFMap = (Module['_FPDF_GetDefaultTTFMap'] = createExportWrapper('FPDF_GetDefaultTTFMap'));
    var _FPDF_GetDefaultSystemFontInfo = (Module['_FPDF_GetDefaultSystemFontInfo'] = createExportWrapper(
      'FPDF_GetDefaultSystemFontInfo'
    ));
    var _FPDF_FreeDefaultSystemFontInfo = (Module['_FPDF_FreeDefaultSystemFontInfo'] = createExportWrapper(
      'FPDF_FreeDefaultSystemFontInfo'
    ));
    var _FPDFText_LoadPage = (Module['_FPDFText_LoadPage'] = createExportWrapper('FPDFText_LoadPage'));
    var _FPDFText_ClosePage = (Module['_FPDFText_ClosePage'] = createExportWrapper('FPDFText_ClosePage'));
    var _FPDFText_CountChars = (Module['_FPDFText_CountChars'] = createExportWrapper('FPDFText_CountChars'));
    var _FPDFText_GetUnicode = (Module['_FPDFText_GetUnicode'] = createExportWrapper('FPDFText_GetUnicode'));
    var _FPDFText_IsGenerated = (Module['_FPDFText_IsGenerated'] = createExportWrapper('FPDFText_IsGenerated'));
    var _FPDFText_IsHyphen = (Module['_FPDFText_IsHyphen'] = createExportWrapper('FPDFText_IsHyphen'));
    var _FPDFText_HasUnicodeMapError = (Module['_FPDFText_HasUnicodeMapError'] =
      createExportWrapper('FPDFText_HasUnicodeMapError'));
    var _FPDFText_GetFontSize = (Module['_FPDFText_GetFontSize'] = createExportWrapper('FPDFText_GetFontSize'));
    var _FPDFText_GetFontInfo = (Module['_FPDFText_GetFontInfo'] = createExportWrapper('FPDFText_GetFontInfo'));
    var _FPDFText_GetFontWeight = (Module['_FPDFText_GetFontWeight'] = createExportWrapper('FPDFText_GetFontWeight'));
    var _FPDFText_GetTextRenderMode = (Module['_FPDFText_GetTextRenderMode'] =
      createExportWrapper('FPDFText_GetTextRenderMode'));
    var _FPDFText_GetFillColor = (Module['_FPDFText_GetFillColor'] = createExportWrapper('FPDFText_GetFillColor'));
    var _FPDFText_GetStrokeColor = (Module['_FPDFText_GetStrokeColor'] =
      createExportWrapper('FPDFText_GetStrokeColor'));
    var _FPDFText_GetCharAngle = (Module['_FPDFText_GetCharAngle'] = createExportWrapper('FPDFText_GetCharAngle'));
    var _FPDFText_GetCharBox = (Module['_FPDFText_GetCharBox'] = createExportWrapper('FPDFText_GetCharBox'));
    var _FPDFText_GetLooseCharBox = (Module['_FPDFText_GetLooseCharBox'] =
      createExportWrapper('FPDFText_GetLooseCharBox'));
    var _FPDFText_GetMatrix = (Module['_FPDFText_GetMatrix'] = createExportWrapper('FPDFText_GetMatrix'));
    var _FPDFText_GetCharOrigin = (Module['_FPDFText_GetCharOrigin'] = createExportWrapper('FPDFText_GetCharOrigin'));
    var _FPDFText_GetCharIndexAtPos = (Module['_FPDFText_GetCharIndexAtPos'] =
      createExportWrapper('FPDFText_GetCharIndexAtPos'));
    var _FPDFText_GetText = (Module['_FPDFText_GetText'] = createExportWrapper('FPDFText_GetText'));
    var _FPDFText_CountRects = (Module['_FPDFText_CountRects'] = createExportWrapper('FPDFText_CountRects'));
    var _FPDFText_GetRect = (Module['_FPDFText_GetRect'] = createExportWrapper('FPDFText_GetRect'));
    var _FPDFText_GetBoundedText = (Module['_FPDFText_GetBoundedText'] =
      createExportWrapper('FPDFText_GetBoundedText'));
    var _FPDFText_FindStart = (Module['_FPDFText_FindStart'] = createExportWrapper('FPDFText_FindStart'));
    var _FPDFText_FindNext = (Module['_FPDFText_FindNext'] = createExportWrapper('FPDFText_FindNext'));
    var _FPDFText_FindPrev = (Module['_FPDFText_FindPrev'] = createExportWrapper('FPDFText_FindPrev'));
    var _FPDFText_GetSchResultIndex = (Module['_FPDFText_GetSchResultIndex'] =
      createExportWrapper('FPDFText_GetSchResultIndex'));
    var _FPDFText_GetSchCount = (Module['_FPDFText_GetSchCount'] = createExportWrapper('FPDFText_GetSchCount'));
    var _FPDFText_FindClose = (Module['_FPDFText_FindClose'] = createExportWrapper('FPDFText_FindClose'));
    var _FPDFLink_LoadWebLinks = (Module['_FPDFLink_LoadWebLinks'] = createExportWrapper('FPDFLink_LoadWebLinks'));
    var _FPDFLink_CountWebLinks = (Module['_FPDFLink_CountWebLinks'] = createExportWrapper('FPDFLink_CountWebLinks'));
    var _FPDFLink_GetURL = (Module['_FPDFLink_GetURL'] = createExportWrapper('FPDFLink_GetURL'));
    var _FPDFLink_CountRects = (Module['_FPDFLink_CountRects'] = createExportWrapper('FPDFLink_CountRects'));
    var _FPDFLink_GetRect = (Module['_FPDFLink_GetRect'] = createExportWrapper('FPDFLink_GetRect'));
    var _FPDFLink_GetTextRange = (Module['_FPDFLink_GetTextRange'] = createExportWrapper('FPDFLink_GetTextRange'));
    var _FPDFLink_CloseWebLinks = (Module['_FPDFLink_CloseWebLinks'] = createExportWrapper('FPDFLink_CloseWebLinks'));
    var _FPDFPage_GetDecodedThumbnailData = (Module['_FPDFPage_GetDecodedThumbnailData'] = createExportWrapper(
      'FPDFPage_GetDecodedThumbnailData'
    ));
    var _FPDFPage_GetRawThumbnailData = (Module['_FPDFPage_GetRawThumbnailData'] =
      createExportWrapper('FPDFPage_GetRawThumbnailData'));
    var _FPDFPage_GetThumbnailAsBitmap = (Module['_FPDFPage_GetThumbnailAsBitmap'] = createExportWrapper(
      'FPDFPage_GetThumbnailAsBitmap'
    ));
    var _FPDFPage_SetMediaBox = (Module['_FPDFPage_SetMediaBox'] = createExportWrapper('FPDFPage_SetMediaBox'));
    var _FPDFPage_SetCropBox = (Module['_FPDFPage_SetCropBox'] = createExportWrapper('FPDFPage_SetCropBox'));
    var _FPDFPage_SetBleedBox = (Module['_FPDFPage_SetBleedBox'] = createExportWrapper('FPDFPage_SetBleedBox'));
    var _FPDFPage_SetTrimBox = (Module['_FPDFPage_SetTrimBox'] = createExportWrapper('FPDFPage_SetTrimBox'));
    var _FPDFPage_SetArtBox = (Module['_FPDFPage_SetArtBox'] = createExportWrapper('FPDFPage_SetArtBox'));
    var _FPDFPage_GetMediaBox = (Module['_FPDFPage_GetMediaBox'] = createExportWrapper('FPDFPage_GetMediaBox'));
    var _FPDFPage_GetCropBox = (Module['_FPDFPage_GetCropBox'] = createExportWrapper('FPDFPage_GetCropBox'));
    var _FPDFPage_GetBleedBox = (Module['_FPDFPage_GetBleedBox'] = createExportWrapper('FPDFPage_GetBleedBox'));
    var _FPDFPage_GetTrimBox = (Module['_FPDFPage_GetTrimBox'] = createExportWrapper('FPDFPage_GetTrimBox'));
    var _FPDFPage_GetArtBox = (Module['_FPDFPage_GetArtBox'] = createExportWrapper('FPDFPage_GetArtBox'));
    var _FPDFPage_TransFormWithClip = (Module['_FPDFPage_TransFormWithClip'] =
      createExportWrapper('FPDFPage_TransFormWithClip'));
    var _FPDFPageObj_TransformClipPath = (Module['_FPDFPageObj_TransformClipPath'] = createExportWrapper(
      'FPDFPageObj_TransformClipPath'
    ));
    var _FPDFPageObj_GetClipPath = (Module['_FPDFPageObj_GetClipPath'] =
      createExportWrapper('FPDFPageObj_GetClipPath'));
    var _FPDFClipPath_CountPaths = (Module['_FPDFClipPath_CountPaths'] =
      createExportWrapper('FPDFClipPath_CountPaths'));
    var _FPDFClipPath_CountPathSegments = (Module['_FPDFClipPath_CountPathSegments'] = createExportWrapper(
      'FPDFClipPath_CountPathSegments'
    ));
    var _FPDFClipPath_GetPathSegment = (Module['_FPDFClipPath_GetPathSegment'] =
      createExportWrapper('FPDFClipPath_GetPathSegment'));
    var _FPDF_CreateClipPath = (Module['_FPDF_CreateClipPath'] = createExportWrapper('FPDF_CreateClipPath'));
    var _FPDF_DestroyClipPath = (Module['_FPDF_DestroyClipPath'] = createExportWrapper('FPDF_DestroyClipPath'));
    var _FPDFPage_InsertClipPath = (Module['_FPDFPage_InsertClipPath'] =
      createExportWrapper('FPDFPage_InsertClipPath'));
    var _FPDF_InitLibrary = (Module['_FPDF_InitLibrary'] = createExportWrapper('FPDF_InitLibrary'));
    var _malloc = createExportWrapper('malloc');
    var _free = createExportWrapper('free');
    var setTempRet0 = createExportWrapper('setTempRet0');
    var _FPDF_DestroyLibrary = (Module['_FPDF_DestroyLibrary'] = createExportWrapper('FPDF_DestroyLibrary'));
    var _FPDF_SetSandBoxPolicy = (Module['_FPDF_SetSandBoxPolicy'] = createExportWrapper('FPDF_SetSandBoxPolicy'));
    var _FPDF_LoadDocument = (Module['_FPDF_LoadDocument'] = createExportWrapper('FPDF_LoadDocument'));
    var _FPDF_GetFormType = (Module['_FPDF_GetFormType'] = createExportWrapper('FPDF_GetFormType'));
    var _FPDF_LoadXFA = (Module['_FPDF_LoadXFA'] = createExportWrapper('FPDF_LoadXFA'));
    var _FPDF_LoadMemDocument = (Module['_FPDF_LoadMemDocument'] = createExportWrapper('FPDF_LoadMemDocument'));
    var _FPDF_LoadMemDocument64 = (Module['_FPDF_LoadMemDocument64'] = createExportWrapper('FPDF_LoadMemDocument64'));
    var _FPDF_LoadCustomDocument = (Module['_FPDF_LoadCustomDocument'] =
      createExportWrapper('FPDF_LoadCustomDocument'));
    var _FPDF_GetFileVersion = (Module['_FPDF_GetFileVersion'] = createExportWrapper('FPDF_GetFileVersion'));
    var _FPDF_DocumentHasValidCrossReferenceTable = (Module['_FPDF_DocumentHasValidCrossReferenceTable'] =
      createExportWrapper('FPDF_DocumentHasValidCrossReferenceTable'));
    var _FPDF_GetDocPermissions = (Module['_FPDF_GetDocPermissions'] = createExportWrapper('FPDF_GetDocPermissions'));
    var _FPDF_GetDocUserPermissions = (Module['_FPDF_GetDocUserPermissions'] =
      createExportWrapper('FPDF_GetDocUserPermissions'));
    var _FPDF_GetSecurityHandlerRevision = (Module['_FPDF_GetSecurityHandlerRevision'] = createExportWrapper(
      'FPDF_GetSecurityHandlerRevision'
    ));
    var _FPDF_GetPageCount = (Module['_FPDF_GetPageCount'] = createExportWrapper('FPDF_GetPageCount'));
    var _FPDF_LoadPage = (Module['_FPDF_LoadPage'] = createExportWrapper('FPDF_LoadPage'));
    var _FPDF_GetPageWidthF = (Module['_FPDF_GetPageWidthF'] = createExportWrapper('FPDF_GetPageWidthF'));
    var _FPDF_GetPageWidth = (Module['_FPDF_GetPageWidth'] = createExportWrapper('FPDF_GetPageWidth'));
    var _FPDF_GetPageHeightF = (Module['_FPDF_GetPageHeightF'] = createExportWrapper('FPDF_GetPageHeightF'));
    var _FPDF_GetPageHeight = (Module['_FPDF_GetPageHeight'] = createExportWrapper('FPDF_GetPageHeight'));
    var _FPDF_GetPageBoundingBox = (Module['_FPDF_GetPageBoundingBox'] =
      createExportWrapper('FPDF_GetPageBoundingBox'));
    var _FPDF_RenderPageBitmap = (Module['_FPDF_RenderPageBitmap'] = createExportWrapper('FPDF_RenderPageBitmap'));
    var _FPDF_RenderPageBitmapWithMatrix = (Module['_FPDF_RenderPageBitmapWithMatrix'] = createExportWrapper(
      'FPDF_RenderPageBitmapWithMatrix'
    ));
    var _FPDF_ClosePage = (Module['_FPDF_ClosePage'] = createExportWrapper('FPDF_ClosePage'));
    var _FPDF_CloseDocument = (Module['_FPDF_CloseDocument'] = createExportWrapper('FPDF_CloseDocument'));
    var _FPDF_GetLastError = (Module['_FPDF_GetLastError'] = createExportWrapper('FPDF_GetLastError'));
    var _FPDF_DeviceToPage = (Module['_FPDF_DeviceToPage'] = createExportWrapper('FPDF_DeviceToPage'));
    var _FPDF_PageToDevice = (Module['_FPDF_PageToDevice'] = createExportWrapper('FPDF_PageToDevice'));
    var _FPDFBitmap_Create = (Module['_FPDFBitmap_Create'] = createExportWrapper('FPDFBitmap_Create'));
    var _FPDFBitmap_CreateEx = (Module['_FPDFBitmap_CreateEx'] = createExportWrapper('FPDFBitmap_CreateEx'));
    var _FPDFBitmap_GetFormat = (Module['_FPDFBitmap_GetFormat'] = createExportWrapper('FPDFBitmap_GetFormat'));
    var _FPDFBitmap_FillRect = (Module['_FPDFBitmap_FillRect'] = createExportWrapper('FPDFBitmap_FillRect'));
    var _FPDFBitmap_GetBuffer = (Module['_FPDFBitmap_GetBuffer'] = createExportWrapper('FPDFBitmap_GetBuffer'));
    var _FPDFBitmap_GetWidth = (Module['_FPDFBitmap_GetWidth'] = createExportWrapper('FPDFBitmap_GetWidth'));
    var _FPDFBitmap_GetHeight = (Module['_FPDFBitmap_GetHeight'] = createExportWrapper('FPDFBitmap_GetHeight'));
    var _FPDFBitmap_GetStride = (Module['_FPDFBitmap_GetStride'] = createExportWrapper('FPDFBitmap_GetStride'));
    var _FPDFBitmap_Destroy = (Module['_FPDFBitmap_Destroy'] = createExportWrapper('FPDFBitmap_Destroy'));
    var _FPDF_GetPageSizeByIndexF = (Module['_FPDF_GetPageSizeByIndexF'] =
      createExportWrapper('FPDF_GetPageSizeByIndexF'));
    var _FPDF_GetPageSizeByIndex = (Module['_FPDF_GetPageSizeByIndex'] =
      createExportWrapper('FPDF_GetPageSizeByIndex'));
    var _FPDF_VIEWERREF_GetPrintScaling = (Module['_FPDF_VIEWERREF_GetPrintScaling'] = createExportWrapper(
      'FPDF_VIEWERREF_GetPrintScaling'
    ));
    var _FPDF_VIEWERREF_GetNumCopies = (Module['_FPDF_VIEWERREF_GetNumCopies'] =
      createExportWrapper('FPDF_VIEWERREF_GetNumCopies'));
    var _FPDF_VIEWERREF_GetPrintPageRange = (Module['_FPDF_VIEWERREF_GetPrintPageRange'] = createExportWrapper(
      'FPDF_VIEWERREF_GetPrintPageRange'
    ));
    var _FPDF_VIEWERREF_GetPrintPageRangeCount = (Module['_FPDF_VIEWERREF_GetPrintPageRangeCount'] =
      createExportWrapper('FPDF_VIEWERREF_GetPrintPageRangeCount'));
    var _FPDF_VIEWERREF_GetPrintPageRangeElement = (Module['_FPDF_VIEWERREF_GetPrintPageRangeElement'] =
      createExportWrapper('FPDF_VIEWERREF_GetPrintPageRangeElement'));
    var _FPDF_VIEWERREF_GetDuplex = (Module['_FPDF_VIEWERREF_GetDuplex'] =
      createExportWrapper('FPDF_VIEWERREF_GetDuplex'));
    var _FPDF_VIEWERREF_GetName = (Module['_FPDF_VIEWERREF_GetName'] = createExportWrapper('FPDF_VIEWERREF_GetName'));
    var _FPDF_CountNamedDests = (Module['_FPDF_CountNamedDests'] = createExportWrapper('FPDF_CountNamedDests'));
    var _FPDF_GetNamedDestByName = (Module['_FPDF_GetNamedDestByName'] =
      createExportWrapper('FPDF_GetNamedDestByName'));
    var _FPDF_GetNamedDest = (Module['_FPDF_GetNamedDest'] = createExportWrapper('FPDF_GetNamedDest'));
    var _FPDF_GetXFAPacketCount = (Module['_FPDF_GetXFAPacketCount'] = createExportWrapper('FPDF_GetXFAPacketCount'));
    var _FPDF_GetXFAPacketName = (Module['_FPDF_GetXFAPacketName'] = createExportWrapper('FPDF_GetXFAPacketName'));
    var _FPDF_GetXFAPacketContent = (Module['_FPDF_GetXFAPacketContent'] =
      createExportWrapper('FPDF_GetXFAPacketContent'));
    var _FPDF_GetTrailerEnds = (Module['_FPDF_GetTrailerEnds'] = createExportWrapper('FPDF_GetTrailerEnds'));
    var ___errno_location = createExportWrapper('__errno_location');
    var _fflush = (Module['_fflush'] = createExportWrapper('fflush'));
    var _setThrew = createExportWrapper('setThrew');
    var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports['emscripten_stack_init'])();
    var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'])();
    var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'])();
    var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'])();
    var stackSave = createExportWrapper('stackSave');
    var stackRestore = createExportWrapper('stackRestore');
    var stackAlloc = createExportWrapper('stackAlloc');
    var _emscripten_stack_get_current = () =>
      (_emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'])();
    var ___cxa_demangle = createExportWrapper('__cxa_demangle');
    var dynCall_ji = (Module['dynCall_ji'] = createExportWrapper('dynCall_ji'));
    var dynCall_jij = (Module['dynCall_jij'] = createExportWrapper('dynCall_jij'));
    var dynCall_iiiij = (Module['dynCall_iiiij'] = createExportWrapper('dynCall_iiiij'));
    var dynCall_iij = (Module['dynCall_iij'] = createExportWrapper('dynCall_iij'));
    var dynCall_iiij = (Module['dynCall_iiij'] = createExportWrapper('dynCall_iiij'));
    var dynCall_j = (Module['dynCall_j'] = createExportWrapper('dynCall_j'));
    var dynCall_jji = (Module['dynCall_jji'] = createExportWrapper('dynCall_jji'));
    var dynCall_iji = (Module['dynCall_iji'] = createExportWrapper('dynCall_iji'));
    var dynCall_viijii = (Module['dynCall_viijii'] = createExportWrapper('dynCall_viijii'));
    var dynCall_iiji = (Module['dynCall_iiji'] = createExportWrapper('dynCall_iiji'));
    var dynCall_jiji = (Module['dynCall_jiji'] = createExportWrapper('dynCall_jiji'));
    var dynCall_iiiiij = (Module['dynCall_iiiiij'] = createExportWrapper('dynCall_iiiiij'));
    var dynCall_iiiiijj = (Module['dynCall_iiiiijj'] = createExportWrapper('dynCall_iiiiijj'));
    var dynCall_iiiiiijj = (Module['dynCall_iiiiiijj'] = createExportWrapper('dynCall_iiiiiijj'));
    var dynCall_viji = (Module['dynCall_viji'] = createExportWrapper('dynCall_viji'));
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vi(index, a1) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_v(index) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    Module['wasmExports'] = wasmExports;
    Module['ccall'] = ccall;
    Module['cwrap'] = cwrap;
    var missingLibrarySymbols = [
      'writeI53ToI64',
      'writeI53ToI64Clamped',
      'writeI53ToI64Signaling',
      'writeI53ToU64Clamped',
      'writeI53ToU64Signaling',
      'readI53FromI64',
      'readI53FromU64',
      'convertI32PairToI53',
      'convertU32PairToI53',
      'exitJS',
      'inetPton4',
      'inetNtop4',
      'inetPton6',
      'inetNtop6',
      'readSockaddr',
      'writeSockaddr',
      'getHostByName',
      'getCallstack',
      'emscriptenLog',
      'convertPCtoSourceLocation',
      'readEmAsmArgs',
      'jstoi_q',
      'jstoi_s',
      'listenOnce',
      'autoResumeAudioContext',
      'dynCallLegacy',
      'getDynCaller',
      'dynCall',
      'handleException',
      'keepRuntimeAlive',
      'runtimeKeepalivePush',
      'runtimeKeepalivePop',
      'callUserCallback',
      'maybeExit',
      'asmjsMangle',
      'handleAllocatorInit',
      'HandleAllocator',
      'getNativeTypeSize',
      'STACK_SIZE',
      'STACK_ALIGN',
      'POINTER_SIZE',
      'ASSERTIONS',
      'uleb128Encode',
      'sigToWasmTypes',
      'generateFuncType',
      'convertJsFunctionToWasm',
      'getEmptyTableSlot',
      'updateTableMap',
      'getFunctionAddress',
      'addFunction',
      'removeFunction',
      'reallyNegative',
      'unSign',
      'strLen',
      'reSign',
      'formatString',
      'intArrayToString',
      'AsciiToString',
      'UTF16ToString',
      'stringToUTF16',
      'lengthBytesUTF16',
      'UTF32ToString',
      'stringToUTF32',
      'lengthBytesUTF32',
      'registerKeyEventCallback',
      'maybeCStringToJsString',
      'findEventTarget',
      'findCanvasEventTarget',
      'getBoundingClientRect',
      'fillMouseEventData',
      'registerMouseEventCallback',
      'registerWheelEventCallback',
      'registerUiEventCallback',
      'registerFocusEventCallback',
      'fillDeviceOrientationEventData',
      'registerDeviceOrientationEventCallback',
      'fillDeviceMotionEventData',
      'registerDeviceMotionEventCallback',
      'screenOrientation',
      'fillOrientationChangeEventData',
      'registerOrientationChangeEventCallback',
      'fillFullscreenChangeEventData',
      'registerFullscreenChangeEventCallback',
      'JSEvents_requestFullscreen',
      'JSEvents_resizeCanvasForFullscreen',
      'registerRestoreOldStyle',
      'hideEverythingExceptGivenElement',
      'restoreHiddenElements',
      'setLetterbox',
      'softFullscreenResizeWebGLRenderTarget',
      'doRequestFullscreen',
      'fillPointerlockChangeEventData',
      'registerPointerlockChangeEventCallback',
      'registerPointerlockErrorEventCallback',
      'requestPointerLock',
      'fillVisibilityChangeEventData',
      'registerVisibilityChangeEventCallback',
      'registerTouchEventCallback',
      'fillGamepadEventData',
      'registerGamepadEventCallback',
      'registerBeforeUnloadEventCallback',
      'fillBatteryEventData',
      'battery',
      'registerBatteryEventCallback',
      'setCanvasElementSize',
      'getCanvasElementSize',
      'checkWasiClock',
      'wasiRightsToMuslOFlags',
      'wasiOFlagsToMuslOFlags',
      'createDyncallWrapper',
      'safeSetTimeout',
      'setImmediateWrapped',
      'clearImmediateWrapped',
      'polyfillSetImmediate',
      'getPromise',
      'makePromise',
      'idsToPromises',
      'makePromiseCallback',
      'ExceptionInfo',
      'findMatchingCatch',
      'setMainLoop',
      'getSocketFromFD',
      'getSocketAddress',
      'FS_unlink',
      'FS_mkdirTree',
      '_setNetworkCallback',
      'heapObjectForWebGLType',
      'heapAccessShiftForWebGLHeap',
      'webgl_enable_ANGLE_instanced_arrays',
      'webgl_enable_OES_vertex_array_object',
      'webgl_enable_WEBGL_draw_buffers',
      'webgl_enable_WEBGL_multi_draw',
      'emscriptenWebGLGet',
      'computeUnpackAlignedImageSize',
      'colorChannelsInGlTextureFormat',
      'emscriptenWebGLGetTexPixelData',
      '__glGenObject',
      'emscriptenWebGLGetUniform',
      'webglGetUniformLocation',
      'webglPrepareUniformLocationsBeforeFirstUse',
      'webglGetLeftBracePos',
      'emscriptenWebGLGetVertexAttrib',
      '__glGetActiveAttribOrUniform',
      'writeGLArray',
      'registerWebGlEventCallback',
      'runAndAbortIfError',
      'SDL_unicode',
      'SDL_ttfContext',
      'SDL_audio',
      'ALLOC_NORMAL',
      'ALLOC_STACK',
      'allocate',
      'writeStringToMemory',
      'writeAsciiToMemory',
    ];
    missingLibrarySymbols.forEach(missingLibrarySymbol);
    var unexportedSymbols = [
      'run',
      'addOnPreRun',
      'addOnInit',
      'addOnPreMain',
      'addOnExit',
      'addOnPostRun',
      'addRunDependency',
      'removeRunDependency',
      'FS_createFolder',
      'FS_createPath',
      'FS_createLazyFile',
      'FS_createLink',
      'FS_createDevice',
      'FS_readFile',
      'out',
      'err',
      'callMain',
      'abort',
      'wasmMemory',
      'stackAlloc',
      'stackSave',
      'stackRestore',
      'getTempRet0',
      'setTempRet0',
      'writeStackCookie',
      'checkStackCookie',
      'convertI32PairToI53Checked',
      'ptrToString',
      'zeroMemory',
      'getHeapMax',
      'growMemory',
      'ENV',
      'MONTH_DAYS_REGULAR',
      'MONTH_DAYS_LEAP',
      'MONTH_DAYS_REGULAR_CUMULATIVE',
      'MONTH_DAYS_LEAP_CUMULATIVE',
      'isLeapYear',
      'ydayFromDate',
      'arraySum',
      'addDays',
      'ERRNO_CODES',
      'ERRNO_MESSAGES',
      'setErrNo',
      'DNS',
      'Protocols',
      'Sockets',
      'initRandomFill',
      'randomFill',
      'timers',
      'warnOnce',
      'UNWIND_CACHE',
      'readEmAsmArgsArray',
      'getExecutableName',
      'asyncLoad',
      'alignMemory',
      'mmapAlloc',
      'wasmTable',
      'noExitRuntime',
      'getCFunc',
      'freeTableIndexes',
      'functionsInTableMap',
      'setValue',
      'getValue',
      'PATH',
      'PATH_FS',
      'UTF8Decoder',
      'UTF8ArrayToString',
      'UTF8ToString',
      'stringToUTF8Array',
      'stringToUTF8',
      'lengthBytesUTF8',
      'intArrayFromString',
      'stringToAscii',
      'UTF16Decoder',
      'stringToNewUTF8',
      'stringToUTF8OnStack',
      'writeArrayToMemory',
      'JSEvents',
      'specialHTMLTargets',
      'currentFullscreenStrategy',
      'restoreOldWindowedStyle',
      'demangle',
      'demangleAll',
      'jsStackTrace',
      'stackTrace',
      'ExitStatus',
      'getEnvStrings',
      'doReadv',
      'doWritev',
      'promiseMap',
      'uncaughtExceptionCount',
      'exceptionLast',
      'exceptionCaught',
      'Browser',
      'wget',
      'SYSCALLS',
      'preloadPlugins',
      'FS_createPreloadedFile',
      'FS_modeStringToFlags',
      'FS_getMode',
      'FS_stdin_getChar_buffer',
      'FS_stdin_getChar',
      'FS',
      'FS_createDataFile',
      'MEMFS',
      'TTY',
      'PIPEFS',
      'SOCKFS',
      'tempFixedLengthArray',
      'miniTempWebGLFloatBuffers',
      'miniTempWebGLIntBuffers',
      'GL',
      'emscripten_webgl_power_preferences',
      'AL',
      'GLUT',
      'EGL',
      'GLEW',
      'IDBStore',
      'SDL',
      'SDL_gfx',
      'allocateUTF8',
      'allocateUTF8OnStack',
    ];
    unexportedSymbols.forEach(unexportedRuntimeSymbol);
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function stackCheckInit() {
      _emscripten_stack_init();
      writeStackCookie();
    }
    function run() {
      if (runDependencies > 0) {
        return;
      }
      stackCheckInit();
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module['calledRun'] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
        assert(
          !Module['_main'],
          'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'
        );
        postRun();
      }
      if (Module['setStatus']) {
        Module['setStatus']('Running...');
        setTimeout(function () {
          setTimeout(function () {
            Module['setStatus']('');
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
      checkStackCookie();
    }
    if (Module['preInit']) {
      if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
      while (Module['preInit'].length > 0) {
        Module['preInit'].pop()();
      }
    }
    run();

    return moduleArg.ready;
  };
})();
if (typeof exports === 'object' && typeof module === 'object') module.exports = PDFiumModule;
else if (typeof define === 'function' && define['amd']) define([], () => PDFiumModule);

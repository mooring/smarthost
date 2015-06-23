Page                  license
Page                  instfiles
RequestExecutionLevel user

OutFile               "SmartHost.exe"
Caption               "SmartHost Fiddler Extension"
Icon                  "..\src\native\res\favicon.ico"
LicenseData           "..\src\native\res\readme.txt"
Name                  "SmartHost"
CRCCheck              on
XPStyle               on
AutoCloseWindow       false
ShowUninstDetails     show
LicenseBkColor        ffffff
LicenseText           "Ready To Intall Smarthost Extension for Fiddler?" "Next"
DetailsButtonText     "DETAILS"
CompletedText         "Completed"
MiscButtonText        "Previous" "Next" "Cancel" "OK"
InstallButtonText     "Install"

UninstallCaption      "Remove SmartHost Extension"
UninstallButtonText   "Remove"
UninstallIcon         "..\src\native\res\favicon.ico"
UninstallText         "Are you Sure" "Smarthost path:"
UninstPage            uninstConfirm
UninstPage            instfiles

VIProductVersion                      1.1.0.8
VIAddVersionKey ProductName           "SmartHost"
VIAddVersionKey Comments              "All Right Reserved By Mooring"
VIAddVersionKey CompanyName           "Tencent .Ltd"
VIAddVersionKey FileDescription       "A Simple Host Mapping Tool for Fiddler"
VIAddVersionKey FileVersion           1.1.0.8
VIAddVersionKey ProductVersion        1.1.0.8
VIAddVersionKey LegalCopyright        "Copyright By mooringniu 2013"
VIAddVersionKey InternalName          "SmartHost.exe"
VIAddVersionKey OriginalFilename      "SmartHost.exe"

Function .onGUIEnd
    IfFileExists "$DOCUMENTS\Fiddler2\Scripts\Smarthost\hostEditor.hta" ext next
    ext:
        Exec  '"mshta.exe" "$DOCUMENTS\Fiddler2\Scripts\Smarthost\hostEditor.hta"'
    next:
FunctionEnd

Section SmartHost
    ReadRegStr $0   HKLM SOFTWARE\Microsoft\Fiddler2 "InstallPath"
    StrCmp     "$0" ""   eq0  nt0
    eq0:
        MessageBox   MB_OK|MB_ICONEXCLAMATION "Can't find Fiddler, Installation Will Quit"
        Quit
    nt0:
    StrCpy           $R1 "$0"
    StrCpy           $R2 "$OUTDIR"

    SetOutPath       "$DOCUMENTS\Fiddler2\"
    CreateDirectory  $OUTDIR\Captures\Responses
    CreateDirectory  $OUTDIR\Captures\Responses\js
    CreateDirectory  $OUTDIR\Captures\Responses\css
    CreateDirectory  $OUTDIR\Captures\Responses\img
    CreateDirectory  $OUTDIR\Scripts\Smarthost

    File             "/oname=$OUTDIR\Scripts\Smarthost.dll"                      Smarthost.dll
    File             "/oname=$OUTDIR\Captures\Responses\favicon.ico"             ..\src\native\res\favicon.ico
    File             "/oname=$OUTDIR\Captures\Responses\index.html"              ..\src\web\index.html
    File             "/oname=$OUTDIR\Captures\Responses\done.html"               ..\src\web\done.html
    File             "/oname=$OUTDIR\Captures\Responses\img\blank.gif"           ..\src\web\img\blank.gif
    File             "/oname=$OUTDIR\Captures\Responses\css\style.css"           ..\src\web\css\style.css
    File             "/oname=$OUTDIR\Captures\Responses\js\appframework.min.js"  ..\src\web\js\appframework.min.js
    File             "/oname=$OUTDIR\Captures\Responses\js\comm.js"              ..\src\web\js\comm.js
    File             "/oname=$OUTDIR\Captures\Responses\js\done.js"              ..\src\web\js\done.js
    File             "/oname=$OUTDIR\Captures\Responses\js\index.js"             ..\src\web\js\index.js
    
    File             "/oname=$OUTDIR\Scripts\Smarthost\README.txt"               ..\src\native\res\readme.txt
    File             "/oname=$OUTDIR\Scripts\Smarthost\smarthost.ico"            ..\src\native\res\favicon.ico
    File             "/oname=$OUTDIR\Scripts\Smarthost\hostEditor.hta"           ..\src\native\res\hostEdit.hta
    File             "/oname=$OUTDIR\Scripts\Smarthost\extend.js"                ..\src\native\res\extend.js
    File             "/oname=$OUTDIR\Scripts\Smarthost\jquery.js"                ..\src\native\res\jquery.js
    File             "/oname=$OUTDIR\Scripts\Smarthost\style.css"                ..\src\native\res\style.css

    CreateDirectory  "$OUTDIR\Captures\Responses\Configs"
    WriteUninstaller "$OUTDIR\Scripts\Smarthost\Uninstall.exe"
    WriteRegStr HKCU "Software\SmartHost" "HostPath" "$OUTDIR"
    WriteRegStr HKCU "Software\SmartHost" "InstallPath" "$OUTDIR"
    IfFileExists     "$OUTDIR\Scripts\Smarthost\hosts" fex fnex
    fnex:
        File         "/oname=$OUTDIR\Scripts\Smarthost\hosts"                    ..\src\native\res\hosts
    fex:
SectionEnd


;Section DesktopShortCut
;    CreateShortCut  "$DESKTOP\Config.lnk" "$OUTDIR\Scripts\Smarthost\hostEditor.hta" "" \
;                    "$OUTDIR\Scripts\Smarthost\smarthost.ico"
;SectionEnd

Section Uninstall
    SetOutPath    "$DOCUMENTS\Fiddler2\"
    Delete        "$Desktop\Config.lnk"
    Delete        "$OUTDIR\Captures\Responses\favicon.ico"
    Delete        "$OUTDIR\Captures\Responses\index.html"
    Delete        "$OUTDIR\Captures\Responses\done.html"
    Delete        "$OUTDIR\Captures\Responses\img\blank.gif"
    Delete        "$OUTDIR\Captures\Responses\css\style.css"
    Delete        "$OUTDIR\Captures\Responses\js\share.js"
    Delete        "$OUTDIR\Captures\Responses\js\appframework.min.js"
    Delete        "$OUTDIR\Captures\Responses\js\comm.js"
    Delete        "$OUTDIR\Captures\Responses\js\index.js"
    Delete        "$OUTDIR\Captures\Responses\js\done.js"

    Delete        "$OUTDIR\Scripts\Smarthost\README.txt"
    Delete        "$OUTDIR\Scripts\Smarthost\smarthost.ico"
    Delete        "$OUTDIR\Scripts\Smarthost\hosts"
    Delete        "$OUTDIR\Scripts\Smarthost\hostEditor.hta"
    Delete        "$OUTDIR\Scripts\Smarthost\extend.js"
    Delete        "$OUTDIR\Scripts\Smarthost\jquery.js"
    Delete        "$OUTDIR\Scripts\Smarthost\style.css"
    Delete        "$OUTDIR\Scripts\Smarthost\Uninstall.exe"
    Delete        "$OUTDIR\Scripts\Smarthost.dll"
    DeleteRegKey   HKCU "Software\SmartHost"
    RMDir         "$OUTDIR\Scripts\Smarthost"
    RMDir         "$OUTDIR\Captures\Responses\Configs"
    RMDir         "$OUTDIR\Captures\Responses\js"
    RMDir         "$OUTDIR\Captures\Responses\css"
    RMDir         "$OUTDIR\Captures\Responses\img"
SectionEnd

// Convert property keyframes to CSV data
// They are sorted by keyframe index

/*TODO: There is a bug in this code
    If the properties have out-of-sync keyframes (differing numbers of keyframes) then the CSV data will be wrong.
    Also the dictToCSV function may crash.
    The properties need to be merged but for my current use case that is not necessary.
*/

(function() {
    function copyToClipboard(string) {
        var cmd, isWindows;

        string = (typeof string === 'string') ? string : string.toString();
        isWindows = $.os.indexOf('Windows') !== -1;
        
        cmd = 'echo "' + string + '" | pbcopy';
        if (isWindows) {
            cmd = 'cmd.exe /c cmd.exe /c "echo ' + string + ' | clip"';
        }

        system.callSystem(cmd);
    }

    function writeFile(filePath, fileContent) {
        var encoding = "utf-8";
        var fileObj = new File(filePath);
        var parentFolder = fileObj.parent;
        if (!parentFolder.exists && !parentFolder.create())
            throw new Error("Cannot create file in path " + fileObj.fsName);

        fileObj.encoding = encoding;
        fileObj.open("w");
        fileObj.write(fileContent);
        fileObj.close();
        
        return fileObj;
    }

    function isSecurityPrefSet() {
        return app.preferences.getPrefAsLong(
            "Main Pref Section",
            "Pref_SCRIPTING_FILE_NETWORK_SECURITY"
        ) === 1;
    }

    function canWriteFiles() {
        if (isSecurityPrefSet()) return true;
        
        alert(script.name + " requires access to write files.\n" +
            "Go to the \"General\" panel of the application preferences and make sure " +
            "\"Allow Scripts to Write Files and Access Network\" is checked.");

        app.executeCommand(2359);
        return isSecurityPrefSet();
    }

    function dictToCSV(dict) {
        var columns = [];
        
        // collect data as columns
        for (var keyName in dict) {
            if (dict.hasOwnProperty(keyName)) {
                var column = [keyName];
                var values = dict[keyName];
                for (var i = 0; i < values.length; ++i) {
                    column.push(values[i]);
                }
                columns.push(column);
            }
        }
        
        if (columns.length === 0) {
            return "";
        }
        
        // convert data to rows
        var rows = [];
        for (var i = 0; i < columns[0].length; ++i) {
            var row = [];
            for (var j = 0; j < columns.length; ++j) {
                row.push("\"" + columns[j][i].toString() + "\"");
            }
            rows.push(row.join(","));
        }
        return rows.join("\n");
    }

    (function main() {
        if (!canWriteFiles()) {
            return;
        }
    
        var activeItem = app.project.activeItem;
        if (!activeItem) {
            alert('No active selection.');
            return;
        }
        
        var selectedProperties = activeItem.selectedProperties;
        var data = {};
        
        for (var i = 0; i < selectedProperties.length; ++i) {
            var prop = selectedProperties[i];
            data[prop.name] = [];
            
            for (var j = 1; j <= prop.numKeys; ++j) {
                var value = prop.keyValue(j);
                data[prop.name].push(value);
            }
        }
        
        var str = dictToCSV(data);
        var projectPath = app.project.file.fsName;
        var folder = projectPath.split("\\").slice(0,-1).join("\\");
        var outputFile = folder + "\\output.csv";
        writeFile(outputFile, str);
    })();
})();

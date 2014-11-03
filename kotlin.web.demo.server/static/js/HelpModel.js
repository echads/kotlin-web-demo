/*
 * Copyright 2000-2014 JetBrains s.r.o.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Created by atamas on 04.08.14.
 */

var HelpModel = (function () {

    function HelpElement(name, text) {
        this.name = name;
        this.text = text;
    }

    function HelpModel(helpType) {
        var helpArray = [];

        var instance = {
            onLoadAllHelpElements: function () {
            },
            onFail: function (exception) {
            },
            loadAllHelpElements: function () {
                loadAllHelp();
            },
            getHelpElement: function (name) {
                return getHelpElement(name);
            }
        };

        function loadAllHelp() {
            $.ajax({
                url: generateAjaxUrl("loadHelpFor" + helpType),
                context: document.body,
                success: function (data) {
                    if (checkDataForNull(data)) {
                        processResult(data);
                    } else {
                        instance.onFail("Incorrect data format.");
                    }
                },
                dataType: "json",
                type: "GET",
                timeout: 30000,
                error: function (jqXHR, textStatus, errorThrown) {
                    instance.onFail(textStatus + " : " + errorThrown);
                }
            });
        }

        function processResult(data) {
            var i = 0;
            while (data[i] != undefined) {
                var helpEl = new HelpElement(data[i].name, data[i].text);
                helpArray.push(helpEl);
                i++;
            }
            instance.onLoadAllHelpElements();
        }

        var counter = 0;
        var result = null;

        function getHelpElement(name) {
            result = null;
            if (helpArray.length <= 0 && counter < 10) {
                setTimeout(function () {
                    counter++;
                    getHelpElement(name);
                }, 100);
            } else {
                counter = 0;
                forEachInArrayWithArgs(helpArray, name, compareHelp);
            }
            return result;
        }

        function compareHelp(name, elementArray) {
            if (name == elementArray.name) {
                result = elementArray.text;
            }
        }

        return instance;
    }


    return HelpModel;
})();
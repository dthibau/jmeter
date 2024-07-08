/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/


    
$(document).ready(function() {
    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });
    
        try{
        refreshcustom_ACTIVE_CONNECTIONSGraph(true);
    } catch(e){
        console.log(e);
    }    
    $(".portlet-header").css("cursor", "auto");
});

var responsecustom_ACTIVE_CONNECTIONSGraphInfos = {
    data: {"result": {"minY": 1.6666666666666665, "minX": 1.6421694E12, "maxY": 10.0, "series": [{"data": [[1.64216952E12, 3.0], [1.6421697E12, 10.0], [1.6421694E12, 2.0], [1.64216958E12, 8.166666666666666], [1.64216946E12, 1.6666666666666665], [1.64216964E12, 10.0]], "isOverall": false, "label": "ACTIVE_CONNECTIONS", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6421697E12, "title": "Connexions BD actives", "X_Axis": "Test duration", "sample_Metric_Name": "ACTIVE_CONNECTIONS", "Y_Axis": "Connexions actives", "content_Message": null}},
    getOptions: function(){
        return {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                mode: "time",
                timeformat: getTimeFormat(this.data.result.granularity),
                axisLabel: 'Test duration',
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: 'Connexions actives',
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponsecustom_ACTIVE_CONNECTIONSGraph'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to
                                // work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : at %x Default content message %y"
            }
        };
    },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponsecustom_ACTIVE_CONNECTIONSGraph"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponsecustom_ACTIVE_CONNECTIONSGraph"), dataset, options);
        // setup overview
        $.plot($("#overviewResponsecustom_ACTIVE_CONNECTIONSGraph"), dataset, prepareOverviewOptions(options));
    }
};

// Response Custom Graph
function refreshcustom_ACTIVE_CONNECTIONSGraph(fixTimestamps) {
    var infos = responsecustom_ACTIVE_CONNECTIONSGraphInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotResponsecustom_ACTIVE_CONNECTIONSGraph"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponsecustom_ACTIVE_CONNECTIONSGraph");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponsecustom_ACTIVE_CONNECTIONSGraph", "#overviewResponsecustom_ACTIVE_CONNECTIONSGraph");
        $('#footerResponsecustom_ACTIVE_CONNECTIONSGraph .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    }else{
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
    
    if(elem.id == "bodyResponsecustom_ACTIVE_CONNECTIONSGraph"){
        if (isGraph($(elem).find('.flot-chart-content')) == false) {
            refreshcustom_ACTIVE_CONNECTIONSGraph(true);
        }
            document.location.href="#custom_ACTIVE_CONNECTIONSGraph";
        }
    }
}

function toggleAll(id, checked){
    var placeholder = document.getElementById(id);
    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);
    var choiceContainer;
    
    if(id == "choicesResponsecustom_ACTIVE_CONNECTIONSGraph"){
        choiceContainer = $("#choicesResponsecustom_ACTIVE_CONNECTIONSGraph");
        refreshcustom_ACTIVE_CONNECTIONSGraph(false);
    }
}
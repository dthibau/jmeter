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
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9069561945590952, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET-TOKEN"], "isController": false}, {"data": [0.875025, 500, 1500, "REST-PRODUITS-FORUNISSEUR"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN"], "isController": false}, {"data": [0.9521212121212121, 500, 1500, "UPDATE-PRODUIT-0"], "isController": false}, {"data": [0.9504545454545454, 500, 1500, "EDITION-PRODUIT"], "isController": false}, {"data": [0.8910606060606061, 500, 1500, "UPDATE-PRODUIT-1"], "isController": false}, {"data": [1.0, 500, 1500, "DISPLAY LOGIN"], "isController": false}, {"data": [1.0, 500, 1500, "ACUATOR ACTIVE CONNEXIONS"], "isController": false}, {"data": [0.8487, 500, 1500, "REST-PRODUITS"], "isController": false}, {"data": [1.0, 3000, 4000, "UPDATE-PRODUIT"], "isController": false}, {"data": [0.893125, 500, 1500, "AJOUT-PRODUIT"], "isController": false}, {"data": [1.0, 500, 1500, "HOME_URLS"], "isController": true}, {"data": [0.9088235294117647, 500, 1500, "FOURNISSEURS"], "isController": false}, {"data": [0.8804545454545455, 500, 1500, "PRODUITS"], "isController": false}, {"data": [1.0, 500, 1500, "DISPLAY LOGIN-1"], "isController": false}, {"data": [1.0, 500, 1500, "DISPLAY LOGIN-0"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN-1"], "isController": false}, {"data": [1.0, 500, 1500, "HOME"], "isController": false}, {"data": [0.9111764705882353, 500, 1500, "FOURNISSEUR-ID-ALEATOIRE"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN-0"], "isController": false}, {"data": [0.9240909090909091, 500, 1500, "PRODUITS-FOURNISSEUR"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 87656, 0, 0.0, 220.7958610933637, 0, 2756, 832.0, 926.0, 1411.9200000000128, 119.95051781139841, 58217.284695208924, 38.98296306505621], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["GET-TOKEN", 20000, 0, 0.0, 3.7733999999999828, 0, 206, 8.0, 13.0, 43.0, 48.364786566196884, 35.55327577722212, 9.322227594408064], "isController": false}, {"data": ["REST-PRODUITS-FORUNISSEUR", 20000, 0, 0.0, 286.43330000000094, 3, 1737, 698.0, 782.0, 922.0, 48.33392945179657, 18772.339399379936, 17.954100665679043], "isController": false}, {"data": ["POST LOGIN", 51, 0, 0.0, 3.8039215686274503, 1, 21, 8.800000000000004, 12.599999999999994, 21.0, 5.1297525648762825, 18.840819723144236, 2.3363044721886945], "isController": false}, {"data": ["UPDATE-PRODUIT-0", 3300, 0, 0.0, 117.59757575757556, 0, 1211, 491.9000000000001, 618.9499999999998, 791.9399999999987, 4.607316977823447, 1.664753204877613, 2.398169023437282], "isController": false}, {"data": ["EDITION-PRODUIT", 3300, 0, 0.0, 121.7999999999998, 0, 1480, 497.8000000000002, 640.0, 815.909999999998, 4.607677228021379, 22.280076078597897, 0.8988365811349127], "isController": false}, {"data": ["UPDATE-PRODUIT-1", 3300, 0, 0.0, 312.5612121212129, 33, 2100, 847.5000000000005, 998.8499999999995, 1217.9799999999996, 4.6067123987570255, 4830.821028263576, 0.8097736638440083], "isController": false}, {"data": ["DISPLAY LOGIN", 51, 0, 0.0, 3.6470588235294112, 1, 20, 6.800000000000004, 12.199999999999989, 20.0, 5.245834190495783, 10.686338009154495, 1.5163739456901872], "isController": false}, {"data": ["ACUATOR ACTIVE CONNEXIONS", 100, 0, 0.0, 5.940000000000002, 1, 142, 12.0, 19.799999999999955, 141.10999999999956, 0.5018417592564712, 0.30704972404976266, 0.10585724609316191], "isController": false}, {"data": ["REST-PRODUITS", 20000, 0, 0.0, 340.8324999999982, 9, 2385, 768.0, 856.0, 1011.9900000000016, 48.30906205540567, 56062.83333488703, 17.284387975512136], "isController": false}, {"data": ["UPDATE-PRODUIT", 3300, 0, 0.0, 430.2609090909096, 34, 2756, 1315.1000000000008, 1603.8499999999995, 1945.9299999999985, 4.606693106293161, 4832.4653250370975, 3.2076145626991868], "isController": false}, {"data": ["AJOUT-PRODUIT", 4000, 0, 0.0, 246.40324999999987, 1, 1558, 641.0, 713.0, 852.0, 9.765005151040217, 5.663717291810091, 6.258312174550688], "isController": false}, {"data": ["HOME_URLS", 50, 0, 0.0, 12.759999999999996, 7, 33, 21.0, 27.699999999999974, 33.0, 5.030687191870409, 1535.2881090275682, 7.531292446423182], "isController": true}, {"data": ["FOURNISSEURS", 1700, 0, 0.0, 231.53705882352915, 0, 1673, 596.9000000000001, 686.9499999999998, 815.98, 4.630953840286574, 13.743621797491112, 0.8321245181764938], "isController": false}, {"data": ["PRODUITS", 3300, 0, 0.0, 321.9527272727271, 32, 1883, 874.0, 1031.0, 1231.9899999999998, 4.60878406310403, 4805.15139391932, 0.8101378235925053], "isController": false}, {"data": ["DISPLAY LOGIN-1", 51, 0, 0.0, 1.2156862745098043, 0, 16, 2.0, 3.3999999999999986, 16.0, 5.248533497993208, 8.554494539209632, 0.9072172159617166], "isController": false}, {"data": ["DISPLAY LOGIN-0", 51, 0, 0.0, 2.0588235294117645, 0, 13, 3.8000000000000043, 4.399999999999999, 13.0, 5.245834190495783, 2.1362430248405677, 0.6096233092470685], "isController": false}, {"data": ["POST LOGIN-1", 51, 0, 0.0, 1.7254901960784312, 0, 11, 4.0, 4.399999999999999, 11.0, 5.134400483237693, 16.792096892932648, 0.8624188311688312], "isController": false}, {"data": ["HOME", 50, 0, 0.0, 1.8399999999999994, 0, 7, 4.0, 6.449999999999996, 7.0, 4.927564797477086, 16.101202941756185, 1.9200179240169508], "isController": false}, {"data": ["FOURNISSEUR-ID-ALEATOIRE", 1700, 0, 0.0, 236.93117647058816, 0, 1122, 601.0, 689.9499999999998, 862.9000000000001, 4.634564582657459, 15.13931850431696, 0.927818104926542], "isController": false}, {"data": ["POST LOGIN-0", 51, 0, 0.0, 1.8627450980392157, 0, 15, 4.0, 6.599999999999994, 15.0, 5.130268584649432, 2.0641315008550447, 1.474814687908661], "isController": false}, {"data": ["PRODUITS-FOURNISSEUR", 3300, 0, 0.0, 195.7890909090911, 11, 2093, 648.9000000000001, 782.0, 956.9899999999998, 4.606172270842929, 1615.006717607181, 1.2595002303086136], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 87656, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

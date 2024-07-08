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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9120510915902338, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET-TOKEN"], "isController": false}, {"data": [0.8891528925619835, 500, 1500, "REST-PRODUITS-FORUNISSEUR"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN"], "isController": false}, {"data": [0.9071316614420063, 500, 1500, "UPDATE-PRODUIT-0"], "isController": false}, {"data": [0.9044461778471139, 500, 1500, "EDITION-PRODUIT"], "isController": false}, {"data": [0.8522727272727273, 500, 1500, "UPDATE-PRODUIT-1"], "isController": false}, {"data": [1.0, 500, 1500, "DISPLAY LOGIN"], "isController": false}, {"data": [0.8766794625719769, 500, 1500, "REST-PRODUITS"], "isController": false}, {"data": [1.0, 500, 1500, "ACTUATOR ACTIVE CONNEXIONS"], "isController": false}, {"data": [0.9956896551724138, 3000, 4000, "UPDATE-PRODUIT"], "isController": false}, {"data": [0.903073940736638, 500, 1500, "AJOUT-PRODUIT"], "isController": false}, {"data": [1.0, 500, 1500, "HOME_URLS"], "isController": true}, {"data": [0.8985304408677397, 500, 1500, "FOURNISSEURS"], "isController": false}, {"data": [0.8503846153846154, 500, 1500, "PRODUITS"], "isController": false}, {"data": [1.0, 500, 1500, "DISPLAY LOGIN-1"], "isController": false}, {"data": [1.0, 500, 1500, "DISPLAY LOGIN-0"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN-1"], "isController": false}, {"data": [1.0, 500, 1500, "HOME"], "isController": false}, {"data": [0.8951442646023927, 500, 1500, "FOURNISSEUR-ID-ALEATOIRE"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN-0"], "isController": false}, {"data": [0.8804347826086957, 500, 1500, "PRODUITS-FOURNISSEUR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 61878, 0, 0.0, 180.93716668282698, 0, 4175, 525.0, 1180.0, 1329.0, 1973.900000000016, 206.05737691270252, 73503.12617397579, 70.34309491500025], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET-TOKEN", 14617, 0, 0.0, 1.8779503318054267, 0, 435, 1.0, 3.0, 5.0, 19.0, 48.89757168042124, 35.945951992265776, 9.282101915868546], "isController": false}, {"data": ["REST-PRODUITS-FORUNISSEUR", 14520, 0, 0.0, 216.70874655647359, 1, 2525, 10.0, 906.0, 1075.0, 1314.789999999999, 48.67631923887937, 15750.659165037277, 17.939230867222935], "isController": false}, {"data": ["POST LOGIN", 51, 0, 0.0, 14.13725490196079, 2, 416, 4.0, 16.400000000000013, 25.599999999999994, 416.0, 2.9005289199795254, 10.653212175823239, 1.3028608954672127], "isController": false}, {"data": ["UPDATE-PRODUIT-0", 1276, 0, 0.0, 190.04231974921638, 0, 1708, 2.0, 841.1999999999998, 1009.8999999999992, 1255.2800000000007, 4.472108900758436, 1.6158987239068567, 2.3136971313752084], "isController": false}, {"data": ["EDITION-PRODUIT", 1282, 0, 0.0, 189.0795631825273, 0, 2240, 2.0, 811.1000000000001, 999.9499999999994, 1284.17, 4.476616488055955, 21.520361353870946, 0.8592223657538839], "isController": false}, {"data": ["UPDATE-PRODUIT-1", 1276, 0, 0.0, 348.5509404388716, 8, 2976, 88.0, 1236.6999999999996, 1512.5999999999995, 1858.23, 4.466864338249451, 3394.4053179172984, 0.7721044803419462], "isController": false}, {"data": ["DISPLAY LOGIN", 51, 0, 0.0, 6.8431372549019605, 2, 76, 4.0, 15.200000000000017, 23.19999999999998, 76.0, 4.869664852477801, 9.920039924090517, 1.3791043039243769], "isController": false}, {"data": ["REST-PRODUITS", 14588, 0, 0.0, 248.2994241842609, 2, 2644, 26.0, 991.0, 1170.0, 1428.2200000000012, 48.775594816172045, 47176.65995838021, 17.308960050729894], "isController": false}, {"data": ["ACTUATOR ACTIVE CONNEXIONS", 27, 0, 0.0, 5.296296296296296, 0, 40, 2.0, 15.599999999999987, 35.99999999999998, 40.0, 0.10378308566332767, 0.06348681017881441, 0.021587692623328898], "isController": false}, {"data": ["UPDATE-PRODUIT", 1276, 0, 0.0, 538.6849529780567, 11, 4175, 89.0, 2048.9999999999995, 2491.3499999999985, 2968.07, 4.466395275981925, 3395.662708044193, 3.082764523879113], "isController": false}, {"data": ["AJOUT-PRODUIT", 7222, 0, 0.0, 194.2816394350599, 0, 2500, 2.0, 838.3999999999996, 1006.8499999999995, 1243.7699999999995, 24.271469428770192, 14.073844562570788, 15.485111297096969], "isController": false}, {"data": ["HOME_URLS", 50, 0, 0.0, 15.399999999999999, 7, 40, 13.5, 26.599999999999994, 32.24999999999998, 40.0, 4.95589255624938, 1512.4619402938843, 7.419319617900683], "isController": true}, {"data": ["FOURNISSEURS", 1429, 0, 0.0, 206.2778166550036, 0, 2321, 1.0, 871.0, 1036.5, 1258.4000000000005, 4.936932330515355, 14.65169663323844, 0.872641359202421], "isController": false}, {"data": ["PRODUITS", 1300, 0, 0.0, 350.71461538461557, 7, 2172, 85.0, 1301.5000000000005, 1479.8500000000001, 1718.88, 4.479746377435862, 3342.155577768828, 0.7743311609435035], "isController": false}, {"data": ["DISPLAY LOGIN-1", 51, 0, 0.0, 2.2352941176470593, 0, 13, 1.0, 6.6000000000000085, 8.399999999999999, 13.0, 4.901960784313726, 7.9896216299019605, 0.8329503676470589], "isController": false}, {"data": ["DISPLAY LOGIN-0", 51, 0, 0.0, 4.294117647058824, 1, 67, 2.0, 8.0, 12.199999999999989, 67.0, 4.87012987012987, 1.9832462459415585, 0.5516943993506493], "isController": false}, {"data": ["POST LOGIN-1", 51, 0, 0.0, 10.11764705882353, 1, 328, 3.0, 9.800000000000004, 18.599999999999994, 328.0, 2.9151186053158042, 9.533918173049441, 0.48110844169762784], "isController": false}, {"data": ["HOME", 50, 0, 0.0, 3.2, 1, 14, 2.5, 5.0, 9.349999999999987, 14.0, 4.576659038901602, 14.954590961098397, 1.7832880434782608], "isController": false}, {"data": ["FOURNISSEUR-ID-ALEATOIRE", 1421, 0, 0.0, 212.78817733990152, 0, 2400, 1.0, 863.8, 1034.0, 1321.4599999999998, 4.926193761310139, 16.09189192512428, 0.9717686911959452], "isController": false}, {"data": ["POST LOGIN-0", 51, 0, 0.0, 3.6862745098039236, 0, 88, 2.0, 4.800000000000004, 7.399999999999999, 88.0, 2.900858881747341, 1.1671424407030317, 0.8242540775553154], "isController": false}, {"data": ["PRODUITS-FOURNISSEUR", 1288, 0, 0.0, 251.69720496894422, 4, 2263, 31.0, 1027.3000000000004, 1213.6499999999999, 1393.3299999999997, 4.460652405046632, 1120.8353632516096, 1.2066413244120284], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 61878, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

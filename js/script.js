var webURL = 'data/category-success.json';
var webURL2 = 'data/category-profitloss.json';
var chart1;
var successfulBusiness = [];
var totalBusiness=[];
var saveData=[];
var totalData=[];
var totalProfitLoss=[];
var category;

$(document).ready(function() {

    //initialise data

    GetProjectType().done(function(data) {
        saveData = data;

        
         buildData(data, 'All', "chart1");
     

         drawChart1();
      

    });
    GetTotalType().done(function(data) {
        totalData = data;

       
         buildProfitData(data, 'All', "chart2");
       
        
        drawChart2();
       

    });


        $('#category').on('change', function() {
            
           
        $('.chart1,.chart2').addClass('show');
        category = $(this).children("option:selected").val();
        if(category ==='All')
        {
            $('.chart1,.chart2').removeClass('show');
        }
        

             totalBusiness.length =0;
             successfulBusiness.length=0;
             totalProfitLoss.length=0;
        
       
         buildData(saveData, category, "chart1");
          buildProfitData(totalData, category, "chart2");

        updateCharts();
        // callGraph();


    });
});
function drawChart1() {


    chart1 = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Total number of successful businesses for an industry',
            align: 'center'
        },
        subtitle: {
            text: 'Data source from NEIS',
            align: 'center'
        },
        xAxis: {
            type: 'category',
            crosshair: true
        },
        yAxis: [{
                min: 0,
                title: {
                    text: 'Total businesses'
                },
            },
            

        ],

        plotOptions: {
            column: {
                pointPadding: 0,

                groupPadding: 0.2,


            }
        },
        tooltip: {

            shared: true,
            useHTML: true
        },

     series: [{


            name: 'Total Business',
            data: totalBusiness

        },
        {


            name: 'Successful Business',
            data: successfulBusiness

        },
        
        ]
    })
}
    function drawChart2() {


    chart2 = Highcharts.chart('container2', {
        chart: {
            type: 'spline'
        },
        
        title: {
            text: 'Total profit loss for an industry',
            align: 'center'
        },
        subtitle: {
            text: 'Data source from ATO',
            align: 'center'
        },
        xAxis: {
            type: 'category',
            crosshair: true
        },
        yAxis: [{
            
             
                title: {
                    text: 'Total businesses'
                },
            },
            

        ],

        plotOptions: {
            column: {
                pointPadding: 0,

                groupPadding: 0.2,


            }
        },
        

     series: [{


            name: 'Total profit loss for this Industry',
            data: totalProfitLoss

        },
        
        
        ],
                tooltip: {
            formatter: function() {

                return 'Total profit loss for ' + this.point.name + ' is ' +  numberConvert(this.y) + ' for '+category +' industry  ';
            }
        },
        plotOptions: {
            column: {
                allowPointSelect: true,
                pointPadding: 0.3,

                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return (numberConvert(this.y));
                    },
                },
                showInLegend: true
            }
        },
    });
}
function updateCharts() {
    chart1.series[0].setData(totalBusiness);
    chart1.series[1].setData(successfulBusiness);
     chart2.series[0].setData(totalProfitLoss);
    
    // chart1.redraw();
}
function chartType(item, chart) {
    switch (chart) {
        case "chart1":
            totalBusiness.push([item.METRO, item.FREQ]);
            successfulBusiness.push([item.METRO, item.success]);
           
           
            break;
        case "chart2":
            totalProfitLoss.push([item.year, convertInt(item.Total)]);

            break;
        case "chart3":
            if(item.attributes.AVERAGE_DETERMINATION_TIME===null ?  avgDetermination.push([category, 0]):+
            avgDetermination.push([category, item.attributes.AVERAGE_DETERMINATION_TIME]));
            break;
        case "chart4":
            cnrSubmitted.push([category, item.attributes.SUBMITTED_COUNT]);
            cnrLodged.push([category, item.attributes.LODGEMENT_COUNT]);
            cnrDetermined.push([category, item.attributes.DETERMINATION_COUNT]);
            break;    
    }
}
function buildData(data, category, chart) {


    $.each(data, function(index, item) {
        
     

        if (item.Enterprise_industry === category ) {

            switch (item.METRO) {

                case "Non-metro area":
                    chartType(item, chart);
                    break;

                case "Metro area":
                    chartType(item, chart);
                    break;

               
            }
        }
    });
}
function buildProfitData(data, category, chart) {


    $.each(data, function(index, item) {
        
     

        if (item.Enterprise_industry === category ) {

            switch (item.year) {
                 case "2012-13":
                    chartType(item, chart);
                    break;
                 case "2014-15":
                    chartType(item, chart);
                    break;
                    
                 case "2015-16":
                    chartType(item, chart);
                    break;

                case "2016-17":
                    chartType(item, chart);
                    break;

               

               
            }
        }
    });
}
function spinner(ref)
{
    $(ref).html('<div class="spinner-border text-white" role="status"><span class="sr-only">Loading...</span> </div>');
}
function GetProjectType() {

    var deffer = $.Deferred();
   
    $.getJSON(webURL, function(data) {
        
     deffer.resolve(data);
});

    
    return deffer.promise();
}
function GetTotalType() {

    var deffer = $.Deferred();
    
    $.getJSON(webURL2, function(data) {
        
     deffer.resolve(data);
});

    
    return deffer.promise();
}
function numberConvert(num) {
    
     let parse= parseInt(num);
     var dollar;
    if (parse < 0 ? dollar ='-$' :dollar = '$');
   num = Math.abs(parse)
    
    
    if (num >= 1000000000) {
        return dollar + (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return dollar + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return dollar + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return dollar +(num);
}
function convertInt(cost) {
    return parseInt(cost);
}
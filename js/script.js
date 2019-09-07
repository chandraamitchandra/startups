var webURL = 'data/category-success.json';
var webURL2 = 'data/category-profitloss.json';
var webURL3 = 'data/category-number.json';
var webURL4 = 'data/category-hub.json';
var chart1;
var successfulBusiness = [];
var totalBusiness=[];
var saveData=[];
var totalData=[];
var numberData=[];
var totalNumberData=[];
var totalProfitLoss=[];
var hubData=[];
var totalHubData=[];
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
    GetNumberType().done(function(data) {
        numberData = data;


       
         buildNumberData(data, 'All', "chart3");
       
        
        drawChart3();
       

    });
    GetHubType().done(function(data) {
        hubData = data;


       
         buildhubData(data, 'All', "chart4");
       
        
        drawChart4();
       

    });



        $('#category').on('change', function() {
            
           
        $('.charts').addClass('show');
        category = $(this).children("option:selected").val();
        if(category ==='All')
        {
            $('.charts').removeClass('show');
        }
        

             totalBusiness.length =0;
             successfulBusiness.length=0;
             totalProfitLoss.length=0;
             totalNumberData.length=0;
             totalHubData.length=0;
        
       
         buildData(saveData, category, "chart1");
          buildProfitData(totalData, category, "chart2");
            buildNumberData(numberData, category, "chart3");
             buildhubData(hubData, category, "chart4");

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
            text: 'Total number of successful businesses for this industry which has received assistance',
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
            type: 'areaspline'
        },
        
        title: {
            text: 'Total Profit/loss for last 7 years in this Sector',
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
  function drawChart3() {

    chart3 = Highcharts.chart('container3', {
        chart: {
            type: 'pie'
        },
        
        title: {
            text: 'Total number of Businesses in this sector',
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

       
        

     series: [{


            name: 'Total number of businesses in this sector',
            data: totalNumberData

        },
        
        
        ],
       
    });
}
function drawChart4() {
    
    console.log(totalHubData);

    chart4 = Highcharts.chart('container4', {
        chart: {
            type: 'column'
        },
        
        title: {
            text: 'Innovation hubs',
            align: 'center'
        },
        subtitle: {
            text: 'Data source from Innovation precincts',
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

       
        

     series: [{


            name: 'Total number of businesses in this sector',
            data: totalHubData

        },
        
        
        ],
       
    });
}
function updateCharts() {
    chart1.series[0].setData(totalBusiness);
    chart1.series[1].setData(successfulBusiness);
    chart2.series[0].setData(totalProfitLoss);
    chart3.series[0].setData(totalNumberData);
     chart4.series[0].setData(totalHubData);
    
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
            totalNumberData.push([item.Type, convertInt(item.Total_number_of_companies)]);
            break;
        case "chart4":
             totalHubData.push([item.State, item.Latitude]);
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
                case "2013-14":
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
function buildNumberData(data, category, chart) {


    $.each(data, function(index, item) {
        
     

        if (item.Enterprise_industry === category ) {

            switch (item.Type) {
                 case "Medium to Very large":
                    chartType(item, chart);
                    break;
                case "Small":
                    chartType(item, chart);
                    break;    
                 case "Micro":
                    chartType(item, chart);
                    break;
               

               

               
            }
        }
    });
}
function buildhubData(data, category, chart) {


    $.each(data, function(index, item) {
        
     

        if (item.Enterprise_industry === category ) {

            switch (item.State) {
                 case "ACT":
                    chartType(item, chart);
                    break;
                case "NSW":
                    chartType(item, chart);
                    break;    
                 case "VIC":
                    chartType(item, chart);
                    break;
                     case "NT":
                    chartType(item, chart);
                    break;
                     case "QLD":
                    chartType(item, chart);
                    break;
                    case "SA":
                    chartType(item, chart);
                    break;
                    case "TAS":
                    chartType(item, chart);
                    break;
                    case "WA":
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
function GetNumberType() {

    var deffer = $.Deferred();
    
    $.getJSON(webURL3, function(data) {
        
     deffer.resolve(data);
});

    
    return deffer.promise();
}
function GetHubType() {

    var deffer = $.Deferred();
    
    $.getJSON(webURL4, function(data) {
        
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
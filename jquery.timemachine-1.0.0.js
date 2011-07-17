/*      
        Time Machine 1.0.0 (A time picker plugin using jQuery)
        Developer Kensen John ( time.machine.kj(a-t)gmail.com)
        Dual licensed:
        GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt)
        MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt).
        Please retaan this section if you use this plugin.
 */
(function($)
{
        /*
         * To invoke and use : 
         * <input type="text" id="timemachine" />
         * 
         * $(document).ready(function(){
         *              $("#timemachine").timemachine({
                                format  :       'AMPM', // add other defaults here
                        });
                });
         */
         /*
         TODO: work on the IE 6 overlapping select bug.
         */
        $.fn.timemachine = function(options)
        {
                var variable = {
                                'inpHrs' : -1,
                                'inpMins' : -1,
                                'inpSecs': -1,
                                'inpAmPm': -1,
                                'divID' : 'div_t_m'
                };
                var config = $.extend({},$.fn.timemachine.defaults,options);
                time_function.create(this,config,variable);
        };
        //Making the default object public
        $.fn.timemachine.defaults = 
        {
                        left:           '', // specify the position of left most pixel
                        top:            '', // specify the position of top most pixel
                        format:         'AMPM', // Specify '24' for 24 hr format
                        showHrs:        true, //Specify whether Hr has to be shown
                        showMins:       true, // specify whether Min has to be shown
                        showSecs:       true, // specify whether Sec has to be shown
                        min_increment:  15, // increment of the minutes be shown
                        sec_increment:  1, // increment of the secs be showns
                        hr_increment:   1       // increment of the Hr be shown.
        };

        time_function = {
                        timeMachId : '6d7',
                        create : function(timemach,config,variable)
                        {
                                this.timeMachId = variable.divID+'_'+$(timemach).attr('id');
                                // If input text box has time, then it is parsed, and drop downs will
                                // automatically select the appropriate time.
                                this.time_parser(timemach,variable,config);
                                // Creating the Div.
                                var timeMachDiv = '<br><div id="'+ this.timeMachId+'" style="display:none;position:absolute;z-index:100"></div>';
                                //$(timemach).after(timeMachDiv);
                                $(timemach).parent().append(timeMachDiv);
                                $("#"+this.timeMachId).css('margin-left','0px');
                                $("#"+this.timeMachId).css('left',this.left_pos(timemach,config));
                                $("#"+this.timeMachId).css('top',this.top_pos(timemach,config));
                                $("#"+this.timeMachId).css('width',this.width(config));
                                $("#"+this.timeMachId).addClass("container-bkg");
                                $("#"+this.timeMachId).append(this.header(timemach,config,variable)); // Create the Header
                                $("#"+this.timeMachId+"_hdr").addClass("header-bkg");
                                $("#"+this.timeMachId+"_hdr").children('div').addClass("header-div");
                                $("#"+this.timeMachId+"_hdr").find('span').addClass("header-text");
                                $("#"+this.timeMachId+"_hdr").css('clear','both');
                                this.display_data.display_hrs(timemach,config,variable);        // Generate Hrs Drop Down
                                this.display_data.display_mins(timemach,config,variable);       // Generate Mins Drop Down
                                this.display_data.display_secs(timemach,config,variable);       // Generate Secs Drop Down
                                this.display_data.display_ampm(timemach,variable);      // Generate AM/PM Drop Down
                                this.display_data.display_ok(timemach,config,variable); // generate Ok Button
                
                                // Adding the click event handler for the input text box
                                $(timemach).bind('click',function()
                                {
                                        $("#"+variable.divID+'_'+$(timemach).attr('id')).show('slow');
                                });
                        },
                        left_pos: function(timemach,config) // retrieve the position of the input text box and return its left position
                        {
                                var lftPos = config.left;
                                if(lftPos=='')
                                {
                                        lftPos = $(timemach).position().left;
                                }
                                return lftPos;
                        },
                        top_pos: function(timemach,config)    // Position where the time machine div has to be displayed
                        {                                       
                                var topPos =  config.top;
                                if(topPos=='')
                                {
                                        topPos = $(timemach).position().top + $(timemach).outerHeight();
                                }
                                return topPos;
                        },
                        header: function(timemach,config,variable)                              // Headers of the timemachine
                        {
                                // Headers are displayed based on the selection of options at startup.

                                var headerDivs = '<div id=\"'+this.timeMachId+'_hdr\">';
                                if( config.showHrs == true)
                                {
                                        headerDivs = headerDivs + '<div id=\"'+this.timeMachId+'_hdr_hrs\">' +
                                        '<span >Hr</span><br></div>';
                                }
                                if(config.showMins == true)
                                {
                                        headerDivs = headerDivs + '<div id=\"'+this.timeMachId+'_hdr_mins\">' +
                                        '<span >Min</span><br></div>';
                                }
                                if(config.showSecs == true)
                                {
                                        headerDivs = headerDivs + '<div id=\"'+this.timeMachId+'_hdr_secs\">' +
                                        '<span >Sec</span><br></div>';
                                }
                                if(config.format == 'AMPM')
                                {
                                        headerDivs = headerDivs + '<div id=\"'+this.timeMachId+'_hdr_ampm\">' +
                                        '<span >Am/Pm</span><br></div>';
                                }
                                headerDivs = headerDivs + '<div id=\"'+this.timeMachId+'_ok\">' +
                                '<span >&nbsp;</span><br></div>';
                                headerDivs = headerDivs + '</div>';
                                return headerDivs;
                        },

                        width: function(config) // Calculate width of the Div based on the options selected. hrs, min, etc..
                        {
                                //TODO: this can probably get into a CSS.
                                //      Then users can easily change the Header Txt, etc
                                var width = 0;
                                if( config.showHrs == true )
                                {
                                        width = width + 60;
                                }

                                if(  config.showMins  == true)
                                {
                                        width = width + 60;
                                }

                                if(  config.showSecs  == true)
                                {
                                        width = width + 60;
                                }

                                if( this.time_format(config) == 'AMPM')
                                {
                                        width = width + 130;
                                }

                                if( this.time_format(config) == '24')
                                {
                                        width = width + 60;
                                }
                                return width;
                        },
         // "AMPM" or "24" hr format. Default is AMPM
                        time_format: function(config)   
                        {
                                return  config.format;
                        },
                        display_data: // Used to display data in appropriate drop downs.
                        {
                                // Each drop down will be pre populated with time from the input text box. 
                                // the selected times should also be passed.

            // display the Hrs Drop down.
                                display_hrs: function(timemach,config,variable) 
                                {
                                        var hrsTable = '';
                                        if( time_function.time_format(config) == 'AMPM')
                                        {
                                                hrsTable = this.get_table(1,12,config.hr_increment,variable.inpHrs);
        
                                        }
                                        else if( time_function.time_format(config) == '24')
                                        {
                                                hrsTable = this.get_table(0,23,config.hr_increment,variable.inpHrs);
                                        }
                                        $("#"+time_function.timeMachId+"_hdr_hrs").append(hrsTable);
                                },
            // display the Mins Drop down.
                                display_mins: function(timemach,config,variable)
                                {
                                        var minsTable = this.get_table(0,59,config.min_increment,variable.inpMins);
                                        $("#"+time_function.timeMachId+"_hdr_mins").append(minsTable);
                                },
            // display the Secs Drop down.
                                display_secs: function(timemach,config,variable)
                                {
                                        var secsTable = this.get_table(0,59,config.sec_increment,variable.inpSecs);
                                        $("#"+time_function.timeMachId+"_hdr_secs").append(secsTable);
                                },
            // display the Am/Pm Drop down if AMPM format selected
                                display_ampm: function(timemach,variable)
                                {
                                        // TODO: Make this variable into a config parameter
                                        //       So that users can change the way this looks
                                        var ampmList = new Array("AM","PM");

                                        var table = '<select>';
                                        var row = '';
                                        for(var i = 0; i<ampmList.length;i++)
                                        {
                                                row = row + '<option value = "' + ampmList[i] + '"';
                                                if(ampmList[i] == variable.inpAmPm)
                                                {
                                                        row = row + ' selected '
                                                }
                                                row = row + '>' + ampmList[i] + '</option>';
                                        }

                                        table = table + row;
                                        table = table + '</select>';

                                        $("#"+time_function.timeMachId+"_hdr_ampm").append(table);

                                },
            // display the Ok Button
                                display_ok:     function(timemach,config,variable)
                                {
                                        var okButton = '<button type="button" id="'+variable.divID+'_'
                           +$(timemach).attr('id')+'_ok_but">Ok</button>';
                                        $("#"+variable.divID+'_'+$(timemach).attr('id')+"_ok").append(okButton);

                                        // Ok Button will invoke the method to set the input textbox with new values.
                                        $("#"+variable.divID+'_'+$(timemach).attr('id')+"_ok_but").bind('click', function() {
                                                time_function.update_time(timemach,variable,config);
                                        });
                                },
            // creating the drop down table
                                get_table:      function(start,stop,increment,selOpt)   
                                {

                                        var table = '<select>';         
                                        var rows = this.get_rows(start,stop,increment,selOpt);
                                        table = table + rows;
                                        table = table + '</select>';

                                        return table;
                                },
            //create the rows of the drop down table.
                                get_rows:       function(start,stop,increment,selOpt)   
                                {
                                        var row = '';
                                        for(var i=start; i<=stop; i=i+increment )
                                        {
                                                var rowVal = i;
                                                if(rowVal<10)
                                                {
                                                        rowVal = '0'+rowVal;
                                                }
                                                row = row + '<option value="'+rowVal+'"';

                                                if(rowVal == selOpt )
                                                {
                                                        // Selection is based on the values identified by the time parser.
                                                        row = row + ' selected ';
                                                }
                                                row = row + '>' + rowVal+'</option>';
                                        }
                                        return row;
                                }
                        },
         // Invoked to update the input time box, when "OK" is clicked.
                        update_time: function(timemach,variable,config) 
                        {
                                // Update each option (hr/min/sec etc) by reading 
            // the selected value from the drop downs.
                                var selTime = '';
                                if( config.showHrs == true )
                                {
                                        selTime = selTime 
                  + $("#"+variable.divID+'_'+$(timemach).attr('id')
                     +"_hdr_hrs option:selected").val();
                                }

                                if(  config.showMins  == true)
                                {
                                        if(config.showHrs == true )
                                        {
                                                selTime = selTime  + ':';
                                        }
                                        selTime = selTime  
                     + $("#"+variable.divID+'_'+$(timemach).attr('id')
                     +"_hdr_mins option:selected").val();
                                }

                                if(  config.showSecs  == true)
                                {
                                        if(config.showHrs == true || config.showMins  == true)
                                        {
                                                selTime = selTime  + ':';
                                        }
                                        selTime = selTime  
                     + $("#"+variable.divID+'_'+$(timemach).attr('id')
                     +"_hdr_secs option:selected").val();
                                }

                                if( this.time_format(config) == 'AMPM')
                                {
                                        selTime = selTime  + ' ' + $("#"+variable.divID+'_'
                     +$(timemach).attr('id')+"_hdr_ampm option:selected").val();
                                }
                                $(timemach).val(selTime);
                                $("#"+variable.divID+'_'+$(timemach).attr('id')).hide('slow');
                                return false;
                        },
         //Code used to parse the time in the input text box.
                        time_parser: function(timemach,variable,config) 
                        {
                                if($(timemach).val()!=undefined && $(timemach) != null 
                           && $(timemach).val()!='' )
                                {
                                        var inputVal = $(timemach).val();

                                        var charList = '';
                                        var isHrSet = false;
                                        var isMinSet = false;
                                        var isSecset = false;
                                        var isAmPmSet = false;

                                        // If an option is not selected during startup, then we do not parse
                                        // the input time for that option.
                                        // ex: If user hides hours, Then we assume that the time specified in
                                        // the text box is only minutes and so one.
                                        if( config.showHrs == false )
                                        {
                                                isHrSet = true;
                                        }
                                        if( config.showMins == false )
                                        {
                                                isMinSet = true;
                                        }
                                        if( config.showSecs == false )
                                        {                                                       
                                                isSecset = true;
                                        }
                                        if( config.format == '24' )
                                        {
                                                isAmPmSet = true;
                                        }

                                        // This is used to identify whether parser has finished identifying
                                        // a complete number.
                                        var isNumParseComplete = false;
                                        // Iterating through every character in the input Time String.
                                        for(var i=0; i<(inputVal.length); i++)
                                        {
                                                var singleChar = inputVal.substring(i,i+1);

                                                // If character is A or P, it indicates, it id AM/PM
                                                // therefore set the particualr variable.
                                                if(singleChar == 'A' || singleChar == 'P')
                                                {
                                                        if(!isAmPmSet)
                                                        {
                                                                variable.inpAmPm = singleChar + 'M';
                                                                isAmPmSet = true;
                                                                return false;
                                                        }
                                                }

                                                if(isNumeric(singleChar) == true && singleChar!= ' ')
                                                {
                                                        // Create a continuous String until an not numeric value is encountered.
                                                        charList = charList + singleChar;
                                                        if(i!=(inputVal.length-1))
                                                        {
                                                                continue;
                                                        }
                                                        isNumParseComplete = true;
                                                }
                                                else
                                                {       
                                                        isNumParseComplete = true;
                                                }
                                                
                                                if(isNumParseComplete == true)
                                                {
                                                        isNumParseComplete = false;
                                                        if(charList<10 && charList.length == 1)
                                                        {       // If value is less than 10, append a zero for aesthetic purposes.
                                                                charList = '0' + charList; 
                                                        }

                                                        // Setting each and every option based on prior codition
                                                        // a) Is option being shown
                                                        // b) Only if the option has not been preciously set.
                                                        if(!isHrSet)
                                                        {
                                                                variable.inpHrs = charList;
                                                                isHrSet = true;
                                                                charList = '';
                                                                continue;
                                                        }
                                                        if(!isMinSet)
                                                        {
                                                                variable.inpMins = charList;
                                                                isMinSet = true;
                                                                charList = '';
                                                                continue;

                                                        }
                                                        if(!isSecset)
                                                        {
                                                                variable.inpSecs = charList;
                                                                isSecset = true;
                                                                charList = '';
                                                                continue;
                                                        }
                                                }
                                        }
                                }
                                return false;
                        }

        }
        
        /*      
        function debug(objDesc, $obj) 
        {
                if (window.console && window.console.log)
                        window.console.log(objDesc + $obj);
        };
        */
        // To check whether an input is a number. Return false if not a number.
        function isNumeric(num){
                return !isNaN(num);
        };
})(jQuery);

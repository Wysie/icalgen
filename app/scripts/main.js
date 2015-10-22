var cal;
var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
var laddaShortLink;
var laddaGCalShortLink;

function init() {
    'use strict';

    gapi.client.setApiKey('GOOGLE_API_BROWSER_KEY');
    gapi.client.load('urlshortener', 'v1',function(){});
}

function googleShorten(longUrl) {
    'use strict';
    var request = gapi.client.urlshortener.url.insert({
        'resource': {
            'longUrl': longUrl
        }
    });

    request.execute(function(response) {
        if(response.id != null) {
            $('#outputGCalShortLink').val(response.id);
            laddaGCalShortLink.stop();
        }
    });
 }

function updatePreview() {
    'use strict';
    var isAllDay = $('#alldayevent').prop('checked');
    var offset = $('#timezones').find(':selected').val();

    var begin = moment.tz($('#inputStartDate2').val() + ' ' +  $('#inputStartTime2').val(), 'lll', offset);
    var end = moment.tz($('#inputEndDate2').val() + ' ' +  $('#inputEndTime2').val(), 'lll', offset);

    var details = '';

    if ($('#includesubject').prop('checked')) {
        details += $('#inputTitle').val();
    }

    if ($('#includedatetime').prop('checked') && $('#inputStartDate2').val() !== '' && $('#inputEndDate2').val() !== '') {
        if (details !== '') {
            details += '<br>';
        }
        if (isAllDay) {
            if (begin.isSame(end, 'day')) {
                details += 'Date: ' + begin.format('ll');
            }
            else {
                details += 'Date: ' + begin.format('ll') + ' - ' + end.format('ll');
            }
        }
        else {
            if (begin.isSame(end, 'day')) {
                details += 'Date and Time: ' + begin.format('lll') + ' - ' + end.format('LT');
            }
            else {
                details += 'Date and Time: ' + begin.format('lll') + ' - ' + end.format('lll');
            }
        }
    }

    if ($('#includevenue').prop('checked') && $('#inputVenue').val() !== '') {
        if (details !== '') {
            details += '<br>';
        }
        details += 'Venue: ' + $('#inputVenue').val();
    }

    if (details !== '') {
        details += '<br>';
    }

    details += $('#inputDetails').val();
    $('#icaldetailscontent').html(details);

    if ($('#icaldetailscontent').html().trim() === '') {
        $('#icaldetails').fadeOut();
    }
    else {
        $('#icaldetails').fadeIn();
    }
}

function generateGoogleCal() {
    'use strict';
    var inputTitle = encodeURIComponent($('#inputTitle').val());
    var isAllDay = $('#alldayevent').is(':checked');
    var offset = $('#timezones').find(':selected').val();

    var begin = moment.tz($('#inputStartDate2').val() + ' ' +  $('#inputStartTime2').val(), 'lll', offset);
    var end = moment.tz($('#inputEndDate2').val() + ' ' +  $('#inputEndTime2').val(), 'lll', offset);

    var gcalStart;
    var gcalEnd;

    if (isAllDay) {
        end.add(1, 'days');
        gcalStart = begin.format('YYYYMMDD');
        gcalEnd = end.format('YYYYMMDD');
    }
    else {
        gcalStart = begin.utc().format('YYYYMMDDTHHmm[00Z]');
        gcalEnd = end.utc().format('YYYYMMDDTHHmm[00Z]');
    }

    var details = '';

    if ($('#includesubject').prop('checked')) {
        details += $('#inputTitle').val();
    }

    if ($('#includedatetime').prop('checked') && $('#inputStartDate2').val() !== '' && $('#inputEndDate2').val() !== '') {
        if (details !== '') {
            details += SEPARATOR;
        }
        if (isAllDay) {
            if (begin.isSame(end, 'day')) {
                details += 'Date: ' + begin.format('ll');
            }
            else {
                details += 'Date: ' + begin.format('ll') + ' - ' + end.format('ll');
            }
        }
        else {
            if (begin.isSame(end, 'day')) {
                details += 'Date and Time: ' + begin.format('lll') + ' - ' + end.format('LT');
            }
            else {
                details += 'Date and Time: ' + begin.format('lll') + ' - ' + end.format('lll');
            }
        }
    }

    if ($('#includevenue').prop('checked') && $('#inputVenue').val() !== '') {
        if (details !== '') {
            details += SEPARATOR;
        }
        details += 'Venue: ' + $('#inputVenue').val();
    }

    if (details !== '') {
        details += SEPARATOR;
    }

    details += $('#inputDetails').val();

    var inputDetails = encodeURIComponent(details);
    var inputVenue = encodeURIComponent($('#inputVenue').val());

    var linkTemplate = 'https://www.google.com/calendar/render?action=TEMPLATE&text=%s&dates=%s/%s&details=%s&location=%s&trp=true&sf=true&output=xml#f';
    var generatedLink = sprintf(linkTemplate, inputTitle, gcalStart, gcalEnd, inputDetails, inputVenue);

    return generatedLink;
}

function generateURL() {
    'use strict';
    var uri = new URI();

    var data = {
        sub: $('#inputTitle').val(),
        det: $('#inputDetails').val(),
        tz: $('#timezones').find(':selected').val(),
        allday: $('#alldayevent').prop('checked'),
        sd: $('#inputStartDate2').val(),
        st: $('#inputStartTime2').val(),
        ed: $('#inputEndDate2').val(),
        et: $('#inputEndTime2').val(),
        venue: $('#inputVenue').val(),
        isub: $('#includesubject').prop('checked'),
        idt: $('#includedatetime').prop('checked'),
        iv: $('#includevenue').prop('checked'),
        dl: 1
    };

    return uri.query(data);
}

function parseURL() {
    'use strict';
    var uri = new URI();
    var query = URI.parse(uri.toString()).query;

    if (query !== '' && query !== undefined) {
        var result = URI.parseQuery(query);

        $('#inputTitle').val(result.sub);
        $('#inputDetails').val(result.det);
        $('#timezones').selectpicker('val', result.tz);
        $('#alldayevent').prop('checked', result.allday === 'true');
        $('#inputStartDate2').val(result.sd);
        $('#inputStartTime2').val(result.st);
        $('#inputEndDate2').val(result.ed);
        $('#inputEndTime2').val(result.et);
        $('#inputVenue').val(result.venue);
        $('#includesubject').prop('checked', result.isub === 'true');
        $('#includedatetime').prop('checked', result.idt === 'true');
        $('#includevenue').prop('checked', result.iv === 'true');

        if (result.dl !== undefined && parseInt(result.dl) === 1) {
            $('#generateFormCalendar').trigger('submit');
        }

        $('#outputDirectLink').val(uri.toString());
        $('#outputGCalLink').val(generateGoogleCal());
        updatePreview();
    }
}

function updateShortLink(response) {
    'use strict';
    $('#outputShortLink').val(response.data.url);
    laddaShortLink.stop();
}

function updateGCalShortLink(response) {
    'use strict';
    $('#outputGCalShortLink').val(response.data.url);
    laddaGCalShortLink.stop();
}

$(function() {
    'use strict';

    laddaShortLink = Ladda.create($('#generateShortLink')[0]);
    laddaGCalShortLink = Ladda.create($('#generateGCalShortLink')[0]);

	$('#generateFormCalendar').validator().on('submit', function(e) {
        if (!e.isDefaultPrevented()) {
            e.preventDefault();

            var isAllDay = $('#alldayevent').is(':checked');
            var offset = $('#timezones').find(':selected').val(); //.data('offset');

            var begin = moment.tz($('#inputStartDate2').val() + ' ' +  $('#inputStartTime2').val(), 'lll', offset);
            var end = moment.tz($('#inputEndDate2').val() + ' ' +  $('#inputEndTime2').val(), 'lll', offset);

            var details = '';

            if ($('#includesubject').prop('checked')) {
                details += $('#inputTitle').val();
            }

            if ($('#includedatetime').prop('checked')) {
                if (details !== '') {
                    details += SEPARATOR;
                }
                if (isAllDay) {
                    if (begin.isSame(end, 'day')) {
                        details += 'Date - ' + begin.format('ll');
                    }
                    else {
                        details += 'Date - ' + begin.format('ll') + ' to ' + end.format('ll');
                    }
                }
                else {
                    if (begin.isSame(end, 'day')) {
                        details += 'Date and Time - ' + begin.format('lll') + ' to ' + end.format('LT');
                    }
                    else {
                        details += 'Date and Time - ' + begin.format('lll') + ' to ' + end.format('lll');
                    }
                }
            }

            if ($('#includevenue').prop('checked')) {
                if (details !== '') {
                    details += SEPARATOR;
                }
                details += 'Venue - ' + $('#inputVenue').val();
            }

            if (details !== '') {
                details += SEPARATOR;
            }

            details += $('#inputDetails').val();

            var title = begin.format('YYYYMMDD') + '-' + $('#inputTitle').val().toLowerCase();
            title = title.replace(/[\W_]+/g,'-');

            cal = ics();
            cal.addEvent($('#inputTitle').val(), details, $('#inputVenue').val(), begin, end, isAllDay);

            cal.download(title);
        }
    });

    $('#generateFormCalendar').on('change', function() {
        updatePreview();
        $('#outputDirectLink').val(generateURL());
        $('#outputGCalLink').val(generateGoogleCal());
    });

    $('#generateFormCalendar').on('dp.change', function() {
        updatePreview();
        $('#outputDirectLink').val(generateURL());
        $('#outputGCalLink').val(generateGoogleCal());
    });

    $('#alldayevent').change(function(){
        $('#timezones').prop('disabled', $('#alldayevent').prop('checked'));
        $('#timezones').selectpicker('refresh');
        $('#inputStartTime2').attr('disabled', $('#alldayevent').prop('checked'));
        $('#inputEndTime2').attr('disabled', $('#alldayevent').prop('checked'));
        $('#inputStartTime2').attr('required', !$('#alldayevent').prop('checked'));
        $('#inputEndTime2').attr('required', !$('#alldayevent').prop('checked'));
        $('#inputStartTime2').parents('.form-group').removeClass('has-error');
        $('#inputEndTime2').parents('.form-group').removeClass('has-error');
    });

    $('#inputStartDate .form-control').on('click', function() {
        $('#inputStartDate').data('DateTimePicker').show();
    });

    $('#inputStartTime .form-control').on('click', function() {
        $('#inputStartTime').data('DateTimePicker').show();
    });

    $('#inputEndDate .form-control').on('click', function() {
        $('#inputEndDate').data('DateTimePicker').show();
    });

    $('#inputEndTime .form-control').on('click', function() {
        $('#inputEndTime').data('DateTimePicker').show();
    });

    $('#generateShortLink').on('click', function() {
	 	laddaShortLink.start();
        var bitly = Bitly.setLogin('BITLY_LOGIN').setKey('BITLY_API_KEY').setCallback(updateShortLink);
        bitly.shorten(generateURL());
    });

    $('#generateGCalShortLink').on('click', function() {
	 	laddaGCalShortLink.start();
        googleShorten(generateGoogleCal());
    });

    $('#timezones').timezones();
    $('#timezones').selectpicker();
	$(':checkbox').checkboxpicker();

    $('#inputStartDate').datetimepicker({
        format: 'll'
    });

    $('#inputStartTime').datetimepicker({
        format: 'LT'
    });

    $('#inputEndDate').datetimepicker({
        format: 'll'
    });

    $('#inputEndTime').datetimepicker({
        format: 'LT'
    });

    parseURL();
});

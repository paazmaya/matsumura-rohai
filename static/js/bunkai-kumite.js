/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */

(function () {
  'use strict';
  var Matsumura = {

    /**
     * Create an input to a table cell if it does not already have it,
     * and set one time event handlers (enter/esc)
     * @param {Zepto} $td A td element wrapped as a Zepto object
     */
    createInlineInput: function ($td) {
      var text = $.trim($td.text() || '');
      var lang = $td.attr('data-lang');
      var id = $td.parents('tr').attr('data-id');

      // insert input which is removed once its data has been sent via enter key
      var tmpl = $('#text_input');
      var html = Hogan.compile(tmpl.html(), { id: id, lang: lang, text: text });

      // Send if enter key comes up later, remove if esc.
      $td.html(html).find('input').focus().on('keyup', this.onInputKeyup);
      $td.attr('data-original', text);
    },

    onInputKeyup: function (event) {
      console.dir(event);
      var $input = $(event.currentTarget);
      var $td = $input.parents('td');

      if (event.which === 13) { // enter
        event.preventDefault();

        var content = $.trim($input.val());
        this.saveTranslation($input.attr('data-id'), $input.attr('lang'), content, $td);
      }
      else if (event.which === 27) { // esc
        // TODO: remove keyup listener if seems hanging...
        $td.remove('.form');
        $td.text($td.attr('data-original'));
        $td.attr('data-original', null);
      }
    },

    /**
     * Save the given translation to the PO file
     */
    saveTranslation: function (id, lang, content, $td) {

      var data = {
        id: id,
        lang: lang,
        content: content
      };

      $.post('/save-translation', data, function (incoming, textStatus) {
        // TODO: Perhaps should check what is the level of success?
        $td.remove('.form');
        $td.text(content);
      }, 'json');
    },
    
    fetchInitialData: function () {
      $.get('/initial-data', function (incoming, textStatus) {
        var header = $('#tmpl_table_header');
        var row = $('#tmpl_table_row');
        var hH = Hogan.compile(header.html());
        var rH = Hogan.compile(row.html());
        
        console.log(row);
        console.log(row.html());
        
        $('thead').html(hH.render({ languages: incoming.languages }));
        $('tbody').html(rH.render({ translations: incoming.translations }));
      
      }, 'json');
    }

  };

  $('button').on('click', function (event) {
    event.preventDefault();
    console.log('Clicked. Now what?');
  });
  
  Matsumura.fetchInitialData();
  
}());

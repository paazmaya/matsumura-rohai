/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

/**
 * @param {HTMLDocument} doc
 * @see https://developer.mozilla.org/en-US/docs/Web/API/document
 */
(function (doc) {

  /**
   * Helper method for replacing jQuery().parents()
   * @param el
   * @param matchSelector
   * @returns {*}
   * @see https://gist.github.com/vfalconi/2714902f0d1c02ca42f2
   */
  function getParents (el, matchSelector) {
    const parent = el.parentNode;
    if ((el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(parent, matchSelector)) {
      return parent;
    }

    return getParents(parent, matchSelector);
  }

  const Matsumura = {

    /**
     * Create an input to a table cell if it does not already have it,
     * and set one time event handlers (enter/esc)
     * @param {HTMLElement} elem A td element wrapped as a jQuery object
     * @returns {void}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/element
     */
    createInlineInput: function createInlineInput(elem) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
      const text = (elem.textContent || '').trim();

      const lang = elem.getAttribute('data-lang');
      const id = getParents(elem, 'tr').getAttribute('data-id');

      // insert input which is removed once its data has been sent via enter key
      const tmpl = doc.querySelector('#text_input');
      const html = Hogan.compile(tmpl.innerHTML, {
        id: id,
        lang: lang,
        text: text
      });

      // Send if enter key comes up later, remove if esc.
      elem.innerHTML = html;

      const input = elem.querySelector('input');
      input.focus();
      input.addEventListener('keyup', this.onInputKeyup);

      elem.setAttribute('data-original', text);
    },

    /**
     *
     * @param {InputEvent} event Key event
     * @returns {void}
     * @see https://developer.mozilla.org/en-US/docs/Web/Events/input
     */
    onInputKeyup: function onInputKeyup(event) {
      console.dir(event);
      const input = event.currentTarget; // HTMLInputElement
      const td = getParents(input, 'td');

      if (event.key === 13) { // enter
        event.preventDefault();

        const content = String.prototype.trim.apply(input.value);
        const data = {
          id: input.getAttribute('data-id'),
          lang: input.getAttribute('lang'),
          content: content
        };
        this.saveTranslation(data, td);
      }
      else if (event.key === 27) { // esc
        input.removeEventListener('keyup', onInputKeyup);

        const forms = document.getElementsByClassName('form');
        td.removeChild(forms);
        td.textContent = td.getAttribute('data-original');
        td.getAttribute('data-original', null);
      }
    },

    /**
     * Save the given translation to the PO file
     *
     * @param {object} data
     * @param {HTMLTableCellElement} cell
     * @returns {void}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement
     */
    saveTranslation: function saveTranslation(data, cell) {
      request.post('/save-translation').send(data).end(function(error, res) {
        // TODO: Perhaps should check what is the level of success?
        const forms = document.getElementsByClassName('form');
        cell.removeChild(forms);
        cell.textContent = data.content;
      });
    },

    /**
     * Gets initial data from back end and creates the table
     * @returns {void}
     */
    fetchInitialData: function fetchInitialData() {
      request.get('/initial-data', function(res) {
        const header = doc.querySelector('#tmpl_table_header');
        const row = doc.querySelector('#tmpl_table_row');
        const hH = Hogan.compile(header.innerHTML);
        const rH = Hogan.compile(row.innerHTML);

        console.log(row);
        console.log(row.innerHTML);

        doc.querySelector('thead').innerHTML = hH.render({
          languages: res.body.languages
        });
        doc.querySelector('tbody').innerHTML = rH.render({
          translations: res.body.translations
        });
      });
    }

  };

  doc.querySelector('button').addEventListener('click', function (event) {
    event.preventDefault();
    console.log('Clicked. Now what?');
  });

  Matsumura.fetchInitialData();

})(document);

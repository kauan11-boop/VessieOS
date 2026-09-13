/*!
 * tiny-dom.js — DOM mínimo (só para os testes em Node).
 *
 * Cobre exatamente o que o coletor usa: querySelectorAll('a[href]'),
 * querySelectorAll('img'), querySelector('title') e querySelector de metatags
 * por property/name. Não é um parser de HTML de verdade e não deve ser usado
 * fora dos testes — no navegador o coletor usa o DOMParser nativo.
 */
'use strict';

function attributes(tagSource) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let match;
  while ((match = re.exec(tagSource))) {
    attrs[match[1].toLowerCase()] = match[3] !== undefined ? match[3] : match[4];
  }
  return attrs;
}

class Element {
  constructor(tag, attrs, text = '') {
    this.tag = tag;
    this.attrs = attrs;
    this.textContent = text;
  }
  getAttribute(name) {
    const value = this.attrs[name.toLowerCase()];
    return value === undefined ? null : value;
  }
}

class JSDOMLike {
  constructor(html) {
    this.elements = [];
    const tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
    let match;
    while ((match = tagRe.exec(html))) {
      const tag = match[1].toLowerCase();
      const attrs = attributes(match[2]);
      let text = '';
      const closeIndex = html.indexOf(`</${tag}`, tagRe.lastIndex);
      if (closeIndex !== -1) text = html.slice(tagRe.lastIndex, closeIndex).replace(/<[^>]*>/g, '').trim();
      this.elements.push(new Element(tag, attrs, text));
    }
  }

  _matches(element, selector) {
    const simple = selector.match(/^([a-zA-Z]+)(\[(.+)\])?$/);
    if (!simple) return false;
    if (element.tag !== simple[1].toLowerCase()) return false;
    if (!simple[3]) return true;
    const attrMatch = simple[3].match(/^([a-zA-Z:_-]+)(=["']?([^"']*)["']?)?$/);
    if (!attrMatch) return false;
    const value = element.getAttribute(attrMatch[1]);
    if (value === null) return false;
    return attrMatch[3] === undefined || value === attrMatch[3];
  }

  querySelectorAll(selector) {
    return this.elements.filter((el) => this._matches(el, selector));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
}

// A API do coletor espera `forEach` direto no resultado de querySelectorAll,
// o que arrays já oferecem.
module.exports = { JSDOMLike };

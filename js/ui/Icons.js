

  var svg = (size, body, extra = "") => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${body}</svg>`;
  var Icons = class _Icons {
    static search = svg(20, '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>');
    static menu = svg(20, '<path d="M4 7h16M4 12h16M4 17h10"/>');
    static back = svg(20, '<path d="M15 5 8 12l7 7"/>');
    static close = svg(20, '<path d="M6 6l12 12M18 6 6 18"/>');
    static home = svg(18, '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>');
    static work = svg(18, '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5h6v2.5"/>');
    static kid = svg(18, '<circle cx="12" cy="6" r="2.6"/><path d="M12 9v6M8 11.5l4-1 4 1M9.5 21l2.5-6 2.5 6"/>');
    static pin = svg(18, '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>');
    static map = svg(18, '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>');
    static locate = svg(20, '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>');
    static lock = svg(15, '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>');
    static chat = svg(20, '<path d="M4 5h16v11H9l-5 4z"/>');
    static phone = svg(20, '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>');
    static share = svg(20, '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4"/>');
    static cancel = svg(20, '<circle cx="12" cy="12" r="8.5"/><path d="m9 9 6 6M15 9l-6 6"/>');
    static check = svg(30, '<path d="m5 12.5 4.5 4.5L19 7.5"/>', ' stroke-width="2.6"');
    static seat = svg(15, '<path d="M8 3h5a2 2 0 0 1 2 2v7l3 3v5H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/>');
    static help = svg(20, '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>');
    static card = svg(18, '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>');
    static history = svg(18, '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5M12 8v4l3 2"/>');
    static star = '<svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';
    static starSmall = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-1px" aria-hidden="true"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';
    /** Іконка за назвою (для місць), за замовчуванням — шпилька. */
    static byName(name) {
      return _Icons[name] ?? _Icons.pin;
    }
  };

export { svg, Icons };

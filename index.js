/**@type {HTMLElement} */
let tt;

const registerTooltips = ()=>{
    /**@type {HTMLElement[]} */
    const targets = Array.from(document.querySelectorAll('[title]:not(.template_element):not(select > option)')).filter(it=>!it.closest('.template_element'));
    for (const target of targets) {
        if (target.classList.contains('sttt--enabled')) {
            if (target.hasAttribute('title')) {
                target.setAttribute('data-sttt--title', target.title.replace(/\r(?!\n)/g, '\n'));
                target.removeAttribute('title');
            }
            continue;
        }
        target.classList.add('sttt--enabled');
        target.setAttribute('data-sttt--title', target.title.replace(/\r(?!\n)/g, '\n'));
        target.removeAttribute('title');
        let thisTt;
        const pointerDown = ()=>{
            window.removeEventListener('pointerdown', pointerDown);
            window.removeEventListener('keydown', pointerDown);
            thisTt?.remove();
        };
        target.addEventListener('pointerenter', (evt)=>{
            if (evt.target != target) {
                if (evt.target.classList.contains('sttt--enabled')) return;
                if (evt.target.closest('.sttt--enabled') != target) return;
            }
            if (!thisTt) {
                thisTt = document.createElement('div'); {
                    thisTt.classList.add('sttt--tooltip');
                }
            }
            tt?.remove();
            tt = thisTt;
            const text = target.getAttribute('data-sttt--title');
            if (text.trim().length == 0) return;
            tt.innerHTML = '';
            for (const line of text.split('\n')) {
                if (/^[\u002D\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]{2,}$/.test(line)) {
                    tt.append(document.createElement('sttt-sep'));
                } else {
                    tt.append(`${line}\n`);
                }
            }
            const layer = evt.target.closest('dialog, body').getBoundingClientRect();
            tt.style.setProperty('--layer-left', `${layer.left}`);
            tt.style.setProperty('--layer-top', `${layer.top}`);
            tt.style.setProperty('--left', `${evt.clientX + 10}`);
            tt.style.setProperty('--top', `${evt.clientY + 15}`);
            tt.style.setProperty('--right', `${window.innerWidth - evt.clientX}`);
            tt.style.setProperty('--bottom', `${window.innerHeight - evt.clientY}`);
            tt.classList.remove('sttt--flip-h');
            tt.classList.remove('sttt--flip-v');
            tt.classList.remove('sttt--active');
            evt.target.closest('dialog, body').append(tt);
            const rect = tt.getBoundingClientRect();
            if (rect.right > window.innerWidth - 10) {
                tt.classList.add('sttt--flip-h');
            }
            if (rect.bottom > window.innerHeight - 10) {
                tt.classList.add('sttt--flip-v');
            }
            tt.classList.add('sttt--active');
            window.addEventListener('pointerdown', pointerDown);
            window.addEventListener('keydown', pointerDown);
        });
        target.addEventListener('pointerleave', ()=>{
            thisTt?.remove();
            if (tt == thisTt) {
                tt = null;
            }
            window.removeEventListener('pointerdown', pointerDown);
            window.removeEventListener('keydown', pointerDown);
        });
    }
};

const init = ()=>{
    const mo = new MutationObserver(muts=>registerTooltips());
    mo.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['title'] });
    window.addEventListener('pointermove', (evt)=>{
        if (!tt) return;
        tt.style.setProperty('--left', `${evt.clientX + 10}`);
        tt.style.setProperty('--top', `${evt.clientY + 15}`);
        tt.style.setProperty('--right', `${window.innerWidth - evt.clientX}`);
        tt.style.setProperty('--bottom', `${window.innerHeight - evt.clientY}`);
        const rect = tt.getBoundingClientRect();
        if (rect.right > window.innerWidth - 10) {
            tt.classList.add('sttt--flip-h');
        }
        if (rect.bottom > window.innerHeight - 10) {
            tt.classList.add('sttt--flip-v');
        }
    });
};
init();

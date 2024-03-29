"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Setter {
    constructor() {
        this.media = { xxl: 1400, xl: 1200, lg: 992, md: 768, sm: 576 };
        this.elementCollection = {};
        this.fnCollection = {};
        this.stylesCollection = {};
    }
    setMediaQueries({ xxl, xl, lg, md, sm }) {
        this.media = { xxl, xl, lg, md, sm };
    }
    registerElements(instruction) {
        const [key, selector] = instruction.split(":");
        const elements = document.querySelectorAll(selector);
        if (key && elements.length !== 0)
            this.elementCollection[key] = Array.from(elements);
    }
    mediaQueries(queries) {
        queries.forEach((query) => this.mediaQuery(query));
    }
    mediaQuery({ instruction, run }) {
        const [filter, mq, min, max] = instruction.split(":");
        const windowWidth = window.innerWidth;
        if (mq && filter === 'min' && windowWidth >= this.media[mq])
            run();
        else if (mq && filter === 'max' && windowWidth < this.media[mq])
            run();
        else if (min && max && filter === 'between' && windowWidth >= this.media[min] && windowWidth < this.media[max])
            run();
        else if (min && max && filter === 'around' && windowWidth < this.media[min] || windowWidth >= this.media[max])
            run();
        return this;
    }
    toggleDisplay(instruction, el) {
        const [display, key, type, selector] = instruction.split(":");
        const elements = this.getElement([key, type, selector].join(':'));
        const setdisplay = (element) => {
            if (!element)
                return this;
            if (display === "toggle") {
                if (element.style.display != "none")
                    element.style.display = "none";
                else
                    element.style.display = "block";
            }
            else
                element.style.display = display;
        };
        if (el)
            setdisplay(el);
        else
            for (const element of elements)
                setdisplay(element);
        return this;
    }
    toggleClass(instruction, el) {
        const [action, current, change, key, type, selector] = instruction.split(":");
        const elements = this.getElement([key, type, selector].join(':'));
        const setclass = (element) => {
            if (!element)
                return this;
            if (action === "toggle") {
                if (element.classList.contains(current)) {
                    element.classList.remove(current);
                    element.classList.add(change);
                }
                else {
                    element.classList.remove(change);
                    element.classList.add(current);
                }
            }
            else {
                element.classList.remove(current);
                element.classList.add(change);
            }
        };
        if (el)
            setclass(el);
        else
            for (const element of elements)
                setclass(element);
        return this;
    }
    getElement(instruction, parent = null) {
        const [key, type, selector] = instruction.split(":");
        const targetDocument = parent || document;
        const elements = selector ? targetDocument.querySelectorAll(selector || '') : undefined;
        let items = [];
        if (elements && elements.length > 0) {
            if (type === 'all')
                items = Array.from(elements);
            else if (type === 'first')
                items.push(elements.item(0));
            else if (type === 'last')
                items.push(elements.item(elements.length - 1));
        }
        if (key && type[0] !== '_')
            this.elementCollection[key] = items;
        const collections = this.elementCollection[key];
        if (!collections || collections.length === 0)
            return items;
        else if (type === '_all')
            items = collections;
        else if (type === '_first')
            items.push(collections[0]);
        else if (type === '_last')
            items.push(collections[collections.length - 1]);
        return items;
    }
    setElement({ instruction, set, element = undefined }) {
        const key = instruction.split(":")[0];
        let elements = this.getElement(instruction, element);
        for (let i = 0; i < elements.length; i++)
            if (elements[i])
                set(elements[i]);
        if (!key)
            return this;
        if (key[0] === '_')
            this.fnCollection[key] = set;
        return this;
    }
    setStyle(instruction, styles, parent) {
        const keys = instruction.split(":")[0];
        const elements = this.getElement(instruction, parent);
        //@ts-ignore
        for (const element of elements)
            for (const key in styles)
                if (element)
                    element.style[key] = styles[key];
        if (!keys)
            return this;
        if (keys[0] === '_')
            this.stylesCollection[keys] = styles;
    }
}
exports.default = Setter;

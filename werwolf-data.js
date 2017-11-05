/*
 All possible roles
*/
const roles = {
    "townsfolk": {
        display_name: "Bürger",
        description: "Ein einfacher Bürger.\n\nGewinnt, wenn alle Werwölfe tot sind.", // Oder wenn alle anderen "Teams" verloren haben?!
        faction: "villagers",

        good: true
    },
    "werewolf": {
        display_name: "Werwolf",
        description: "Ein Werwolf.\n\nGewinnt, wenn alle übrigen Spieler Werwölfe sind.",
        faction: "werewolves",

        good: false
    },
    "witch": {
        display_name: "Hexe",
        description: "Kann einmal pro Spiel einen Heil- und einen Gifttrank einsetzen.\n\nGewinnt mit den Bürgern.",
        faction: "villagers",

        good: true
    },
    "seer": {
        display_name: "Seherin",
        description: "Kann sich jede Nacht die Gesinnung eines Spielers ansehen.\n\nGewinnt mit den Bürgern.",
        faction: "villagers",

        good: true
    },
    "cupid": {
        display_name: "Amor",
        description: "Wählt zwei Spieler als Liebespaar.\n\nGewinnt mit den Bürgern.",
        faction: "villagers",

        good: true
    },
    // "homeless": { // Ich hab kein Icon für den Obdachlosen, deshalb nenn ich ihn doch Dirne.
        // display_name: "Obdachloser",
        // description: "Findet jede Nacht bei einem anderen Spieler Unterkunft. Stirbt, wenn dieser Spieler von den Werwölfen gebissen wird.\n\nGewinnt mit den Bürgern.",
        // faction: "villagers",

        // good: true
    // },
    "harlot": {
        display_name: "Dirne",
        description: "Übernachtet bei einem anderen Spieler. Stirbt, wenn dieser Spieler von den Werwölfen gebissen wird.\n\nGewinnt mit den Bürgern.",
        faction: "villagers",

        good: true
    }
};
let players = new Map();
let set = new Map();
let remaining = new Map();

function add_role(role, desc, elem, elem2) {
    /*
    <div class="role">
        <label data_description="Ein einfacher Bürger.\n\nGewinnt, wenn alle Werwölfe tot sind.">
            <img src="./icons/townsfolk.png" alt="Bürger" class="icon" />
            <span>Bürger</span>
            <input id="role-townsfolk" type="number" value="0" min="0">
        </label>
    </div>
    */
    let img = document.createElement("img");
    img.setAttribute("src", `./icons/${role}.png`);
    img.setAttribute("alt", desc.display_name);
    img.setAttribute("class", "icon");
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(desc.display_name));
    let input = document.createElement("input");
    input.setAttribute("id", `role-${role}`);
    input.setAttribute("type", "number");
    let value = localStorage.set ? new Map(JSON.parse(localStorage.set)).get(r) ? new Map(JSON.parse(localStorage.set)).get(r) : "0" : "0";
    set.set(role, value);
    remaining.set(role, value);
    input.setAttribute("value", value);
    input.setAttribute("tabindex", "1");
    input.addEventListener("change", (e) => {
        let s = new Map(JSON.parse(localStorage.set || "[]"));
        s[role] = e.target.value;
        remaining.set(role, e.target.value - [...players.values()].filter(r => r === role).length);
        set.set(role, s[role]);
        document.querySelector(`label[for="choose-${role}"]`).dataset.remaining = remaining.get(role);
        localStorage.setItem("set", JSON.stringify(Array.from(set.entries())));
    });
    input.setAttribute("min", "0");
    let ddesc = document.createElement("a");
    ddesc.setAttribute("href", "javascript:");
    ddesc.setAttribute("class", "desc");
    ddesc.setAttribute("data-description", desc.description);
    ddesc.appendChild(document.createTextNode("[?]"));
    
    let label = document.createElement("label");
    label.appendChild(img);
    label.appendChild(span);
    label.appendChild(input);
    label.appendChild(ddesc);

    let div = document.createElement("div");
    div.setAttribute("class", "role");
    div.appendChild(label);
    elem.appendChild(div);
    
    // Add the role in the "choose a role"-dialog.
    /*
    <div>
        <input type="radio" value="werewolf" name="role" id="choose-werewolf">
        <label for="choose-werewolf" data-remaining="2">
            <img src="./icons/werewolf.png" alt="Werwolf" class="icon">
            <span>Werwolf</span>
        </label>
    </div>
    */
    input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("value", role);
    input.setAttribute("name", "role");
    input.setAttribute("id", `choose-${role}`);
    img = document.createElement("img");
    img.setAttribute("src", `./icons/${role}.png`);
    img.setAttribute("alt", desc.display_name);
    img.setAttribute("class", "icon");
    span = document.createElement("span");
    span.appendChild(document.createTextNode(desc.display_name));
    label = document.createElement("label");
    label.setAttribute("for", `choose-${role}`);
    label.dataset.remaining = remaining.get(role);
    label.appendChild(img);
    label.appendChild(span);
    div = document.createElement("div");
    div.appendChild(input);
    div.appendChild(label);
    elem2.appendChild(div);
}
function add_player(name, elem) {
    /*
    <div class="player role">
        <img src="./icons/norole.svg" alt="Keine Rolle">
        <span>Franziska</span>
        <a href="javascript:change_role('Franziska')">[Rolle]</a>
        <a href="javascript:delete_player('Franziska')">[x]</a>
    </div>
    */
    let img = document.createElement("img");
    img.setAttribute("src", "./icons/norole.svg");
    img.setAttribute("alt", "Keine Rolle");
    img.setAttribute("title", "Keine Rolle");
    img.addEventListener("click", () => { change_role(name); });
    img.setAttribute("class", "icon");
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(name));
    let a1 = document.createElement("a");
    a1.setAttribute("href", `javascript:change_role('${name}')`);
    a1.appendChild(document.createTextNode("[Rolle]"));
    let a2 = document.createElement("a");
    a2.setAttribute("href", `javascript:delete_player('${name}')`);
    a2.appendChild(document.createTextNode("[x]"));

    let div = document.createElement("div");
    div.setAttribute("class", "player role");
    div.appendChild(img);
    div.appendChild(span);
    div.appendChild(a1);
    div.appendChild(document.createTextNode(" "));
    div.appendChild(a2);
    let lastElement = elem.lastChild;
    while (lastElement.nodeType === 3 /* TEXT_NODE */) {
        lastElement = lastElement.previousSibling;
    }
    elem.insertBefore(div, lastElement);
}
function update_role(name, role) {
    players.set(name, role);

    let players_elem = document.getElementById("players");
    let span_elems = players_elem.querySelectorAll("div>span");

    for (s of span_elems) {
        if (s.textContent === name) {
            let img_elem = s.parentNode.firstChild;
            if (role === null) {
                img_elem.src = "./icons/norole.svg";
                img_elem.alt = "Keine Rolle";
            } else {
                img_elem.src = `./icons/${role}.png`;
                img_elem.alt =  roles[role].display_name;
            }
            img_elem.title = img_elem.alt;
        }
    }
    for (r in roles) {
        remaining.set(r, set.get(r) - [...players.values()].filter(rr => rr === r).length);
        document.querySelector(`label[for="choose-${r}"]`).dataset.remaining = remaining.get(r);
    }
    localStorage.setItem("players", JSON.stringify([...players]));
}
function change_role(name) {
    if (!players.has(name)) {
        _alert("Fehler: Der Spieler existiert nicht!");
    }
    _choose_role_dialog((role) => {
        if (role === null || role === "") {
            return;
        }
        update_role(name, role);
    });
}
function delete_player(name) {
    if (!players.has(name)) {
        return;
    }
    update_role(name, null);
    players.delete(name);
    localStorage.setItem("players", JSON.stringify([...players]));

    let players_elem = document.getElementById("players");
    let span_elems = players_elem.querySelectorAll("div>span");

    for (s of span_elems) {
        if (s.textContent === name) {
            players_elem.removeChild(s.parentNode);
        }
    }
}
function new_player() {
    _prompt("Wie heißt der neue Spieler?", (name) => {
        if (name === null || name === "") {
            return;
        }
        if (players.has(name)) {
            _alert("Dieser Spielername existiert bereits!");
            return;
        }
        players.set(name, null);
        add_player(name, document.getElementById("players"));
        localStorage.setItem("players", JSON.stringify([...players]));
    });
}
let ab_listener = [];
let pb_listener = [];
let pc_listener = [];
let rb_listener = [];
let rc_listener = [];
function _alert(text, cb) {
    document.getElementById("alert-text").textContent = text;
    document.getElementById("alert").style.display = "";
    document.getElementById("alert-button").focus();

    for (l of ab_listener) {
        document.getElementById("alert-button").removeEventListener("click", l);
    }
    ab_listener = [];

    if (!cb) {
        return;
    }
    let callback = (e) => { e.preventDefault(); cb(); };
    ab_listener.push(callback);
    document.getElementById("alert-button").addEventListener("click", callback, {once: true});
}
function _prompt(text, cb) {
    document.getElementById("prompt-text").textContent = text;
    document.getElementById("prompt").style.display = "";
    document.getElementById("prompt-input").focus();

    for (l of pb_listener) {
        document.getElementById("prompt-button").removeEventListener("click", l);
    }
    pb_listener = [];
    for (l of pc_listener) {
        document.getElementById("prompt-cancel").removeEventListener("click", l);
    }
    pc_listener = [];

    if (!cb) {
        cb = () => {};
    }
    let callback = (e) => {
        e.preventDefault();
        let input = document.getElementById("prompt-input");
        let value = input.value;
        input.value = "";
        cb(value);
    };
    pb_listener.push(callback);
    document.getElementById("prompt-button").addEventListener("click", callback, {once: true});

    callback = () => {
        document.getElementById("prompt-input").value = "";
        cb(null);
    };
    pc_listener.push(callback);
    document.getElementById("prompt-cancel").addEventListener("click", callback, {once: true});
}
function _choose_role_dialog(cb) {
    var radio = document.getElementsByName("role");
    for (r of radio) {
        r.checked = false;
    }
    document.getElementById("choose-role").style.display = "";

    for (l of rb_listener) {
        document.getElementById("choose-button").removeEventListener("click", l);
    }
    rb_listener = [];
    for (l of rc_listener) {
        document.getElementById("choose-cancel").removeEventListener("click", l);
    }
    rc_listener = [];

    if (!cb) {
        cb = () => {};
    }
    let callback = (e) => {
        e.preventDefault();
        let value = document.querySelector('#choose-role>form').role.value;
        cb(value);
    };
    rb_listener.push(callback);
    document.getElementById("choose-button").addEventListener("click", callback, {once: true});

    callback = () => {
        cb(null);
    };
    rc_listener.push(callback);
    document.getElementById("choose-cancel").addEventListener("click", callback, {once: true});
}

document.addEventListener("DOMContentLoaded", () => {
    for (r in roles) {
        add_role(r, roles[r], document.getElementById("set"), document.getElementById('choose-a-role'));
    }
    let players_ = localStorage.players ? JSON.parse(localStorage.players) : [];
    for (p of players_) {
        // players.set(p, null);
        // players.set(p[0], p[1]);
        add_player(p[0], document.getElementById("players"));
        update_role(p[0], p[1]);
    }

    document.getElementById("alert-button").addEventListener("click", () => {
        document.getElementById("alert").style.display = "none";
    });
    document.getElementById("prompt-button").addEventListener("click", () => {
        document.getElementById("prompt").style.display = "none";
    });
    document.getElementById("prompt-cancel").addEventListener("click", () => {
        document.getElementById("prompt").style.display = "none";
    });
    document.getElementById("choose-button").addEventListener("click", () => {
        document.getElementById("choose-role").style.display = "none";
    });
    document.getElementById("choose-cancel").addEventListener("click", () => {
        document.getElementById("choose-role").style.display = "none";
    });

    document.getElementById("alert").style.display = "none";
    document.getElementById("prompt").style.display = "none";
    document.getElementById("choose-role").style.display = "none";
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
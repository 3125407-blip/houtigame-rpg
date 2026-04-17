// ゲームの基本状態
const gameState = {
    player: {
        level: 1,
        exp: 0,
        expMax: 100,
        hp: 100,
        hpMax: 100,
        attack: 10,
        gold: 0,
        equipment: {
            sword: 0,
            armor: 0
        }
    },
    enemy: {
        name: 'ゴブリン',
        level: 1,
        hp: 30,
        hpMax: 30,
        attack: 5,
        goldReward: 10,
        expReward: 25
    },
    autoAttackInterval: null,
    battleLog: []
};

// 敵の種類
const enemies = [
    { name: 'ゴブリン', level: 1, hp: 30, attack: 5, goldReward: 10, expReward: 25 },
    { name: 'オーク', level: 5, hp: 60, attack: 10, goldReward: 50, expReward: 100 },
    { name: 'トロル', level: 10, hp: 120, attack: 20, goldReward: 200, expReward: 300 },
    { name: 'ドラゴン', level: 20, hp: 300, attack: 50, goldReward: 1000, expReward: 1500 }
];

// 装備アイテム
const items = {
    'sword': { name: '剣', attackBonus: 5, hpBonus: 0, price: 100 },
    'strong-sword': { name: '強い剣', attackBonus: 15, hpBonus: 0, price: 500 },
    'armor': { name: '鎧', attackBonus: 0, hpBonus: 50, price: 200 },
    'strong-armor': { name: '強い鎧', attackBonus: 0, hpBonus: 150, price: 1000 }
};

// DOM要素
const playerLevelEl = document.getElementById('playerLevel');
const playerExpEl = document.getElementById('playerExp');
const playerExpMaxEl = document.getElementById('playerExpMax');
const playerHPEl = document.getElementById('playerHP');
const playerHPMaxEl = document.getElementById('playerHPMax');
const playerAttackEl = document.getElementById('playerAttack');
const playerGoldEl = document.getElementById('playerGold');
const expProgressEl = document.getElementById('expProgress');

const enemyNameEl = document.getElementById('enemyName');
const enemyLevelEl = document.getElementById('enemyLevel');
const enemyHPEl = document.getElementById('enemyHP');
const enemyHPMaxEl = document.getElementById('enemyHPMax');
const enemyHPProgressEl = document.getElementById('enemyHPProgress');

const attackBtnEl = document.getElementById('attackBtn');
const battleLogEl = document.getElementById('battleLog');

// ゲーム初期化
function initGame() {
    resetEnemy();
    updateUI();
    autoAttack();
    addLog('ゲーム開始！敵に攻撃してゴールドを稼ごう');
}

// UI更新
function updateUI() {
    // プレイヤー情報
    playerLevelEl.textContent = gameState.player.level;
    playerExpEl.textContent = gameState.player.exp;
    playerExpMaxEl.textContent = gameState.player.expMax;
    playerHPEl.textContent = gameState.player.hp;
    playerHPMaxEl.textContent = gameState.player.hpMax;
    playerAttackEl.textContent = gameState.player.attack;
    playerGoldEl.textContent = gameState.player.gold;

    // 経験値バー
    const expPercent = (gameState.player.exp / gameState.player.expMax) * 100;
    expProgressEl.style.width = expPercent + '%';

    // 敵情報
    enemyNameEl.textContent = gameState.enemy.name;
    enemyLevelEl.textContent = gameState.enemy.level;
    enemyHPEl.textContent = gameState.enemy.hp;
    enemyHPMaxEl.textContent = gameState.enemy.hpMax;

    // 敵HPバー
    const hpPercent = (gameState.enemy.hp / gameState.enemy.hpMax) * 100;
    enemyHPProgressEl.style.width = hpPercent + '%';
}

// 攻撃処理
function attack() {
    if (gameState.player.hp <= 0) {
        addLog('プレイヤーが倒された！');
        return;
    }

    // プレイヤーが敵に攻撃
    const damage = Math.max(1, gameState.player.attack + Math.floor(Math.random() * 5) - 2);
    gameState.enemy.hp -= damage;
    addLog(`攻撃！${damage}のダメージを与えた`);

    if (gameState.enemy.hp <= 0) {
        defeatEnemy();
        return;
    }

    // 敵がプレイヤーに反撃
    const enemyDamage = Math.max(1, gameState.enemy.attack + Math.floor(Math.random() * 3) - 1);
    gameState.player.hp -= enemyDamage;
    addLog(`敵の反撃！${enemyDamage}のダメージを受けた`);

   if (gameState.player.hp <= 0) {
    gameState.player.hp = gameState.player.hpMax;
    gameState.player.gold = Math.floor(gameState.player.gold * 0.5);
    addLog('倒された！ゴールドの50%を失った...');
    addLog('復活した！敵と戦い続けよう！');
    resetEnemy();
}

    updateUI();
}

// 敵撃破処理
function defeatEnemy() {
    gameState.player.gold += gameState.enemy.goldReward;
    gameState.player.exp += gameState.enemy.expReward;
    addLog(`${gameState.enemy.name}を倒した！${gameState.enemy.goldReward}G 獲得`);

    // レベルアップチェック
    while (gameState.player.exp >= gameState.player.expMax) {
        levelUp();
    }

    // 敵をリセット
    resetEnemy();
    updateUI();
}

// レベルアップ処理
function levelUp() {
    gameState.player.level++;
    gameState.player.exp -= gameState.player.expMax;
    gameState.player.expMax = Math.floor(gameState.player.expMax * 1.5);
    gameState.player.hpMax += 50;
    gameState.player.hp = gameState.player.hpMax;
    gameState.player.attack += 5;

    addLog(`レベルアップ！現在のレベル: ${gameState.player.level}`);
    selectNextEnemy();
}

// 敵をリセット
function resetEnemy() {
    const enemy = gameState.enemy;
    enemy.hp = enemy.hpMax;
}

// 次の敵を選択
function selectNextEnemy() {
    const maxLevel = Math.min(gameState.player.level, enemies.length - 1);
    const randomIndex = Math.floor(Math.random() * (maxLevel + 1));
    const selectedEnemy = enemies[randomIndex];

    gameState.enemy = {
        name: selectedEnemy.name,
        level: selectedEnemy.level,
        hp: selectedEnemy.hp,
        hpMax: selectedEnemy.hp,
        attack: selectedEnemy.attack,
        goldReward: selectedEnemy.goldReward,
        expReward: selectedEnemy.expReward
    };

    addLog(`${gameState.enemy.name} (Lv.${gameState.enemy.level}) が現れた！`);
    updateUI();
}

// 自動攻撃
function autoAttack() {
    if (gameState.autoAttackInterval) clearInterval(gameState.autoAttackInterval);
    gameState.autoAttackInterval = setInterval(() => {
        if (gameState.player.hp > 0) {
            attack();
        }
    }, 2000);
}

// ログを追加
function addLog(message) {
    gameState.battleLog.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
    if (gameState.battleLog.length > 10) {
        gameState.battleLog.pop();
    }

    battleLogEl.innerHTML = gameState.battleLog
        .map(log => `<p>${log}</p>`)
        .join('');
}

// アイテム購入
function buyItem(itemKey, price) {
    if (gameState.player.gold >= price) {
        gameState.player.gold -= price;
        const item = items[itemKey];

        if (item.attackBonus > 0) {
            gameState.player.attack += item.attackBonus;
        }
        if (item.hpBonus > 0) {
            gameState.player.hpMax += item.hpBonus;
            gameState.player.hp = gameState.player.hpMax;
        }

        addLog(`${item.name}を購入した！`);
        updateUI();
    } else {
        addLog('ゴールドが足りません！');
    }
}

// イベントリスナー
attackBtnEl.addEventListener('click', attack);

document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const itemKey = e.target.dataset.item;
        const price = parseInt(e.target.dataset.price);
        buyItem(itemKey, price);
    });
});

// ゲーム開始
window.addEventListener('DOMContentLoaded', initGame);

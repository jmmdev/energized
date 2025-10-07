export function getSimpleStats(deck) {
    let catComp = [
        {name: "Pokemon", value: 0, "Basic": 0, "Stage1": 0, "Stage2": 0},
        {name: "Trainer", value: 0, "Supporter": 0, "Item": 0, "Stadium": 0},
        {name: "Energy", value: 0},
    ]

    let subcatComp = [
        {
            category: "Pokemon",
            "Pokemon:Basic": 0,
            "Pokemon:Stage1": 0,
            "Pokemon:Stage2": 0,
        },
        {
            category: "Trainer",
            "Trainer:Supporter": 0,
            "Trainer:Item": 0,
            "Trainer:Stadium": 0,
        },
        {
            category: "Energy",
            "Energy:Normal": 0,
            "Energy:Special": 0,
        }
    ]

    let energyDist = [
        {name: "0", value: 0, total: 0},
        {name: "1", value: 0, total: 0},
        {name: "2", value: 0, total: 0},
        {name: "3+", value: 0, total: 0},
    ]

    let drawOdds = {
        basic: [
            {name: "Turn 1 Basic", value: 0},
            {name: "No turn 1 Basic", value: 0}
        ],
        energy: [
            {name: "Turn 1 Energy", value: 0},
            {name: "No turn 1 Energy", value: 0},
        ]
    }

    let basicCount = 0;
    let energyCount = 0;

    for (const slot of deck) {
        const card = slot.card;
        const cardCategory = card.category;

        const index = catComp.findIndex(elem => elem.name === cardCategory);
        catComp[index].value += slot.quantity;
        
        subcatComp[index][`${cardCategory}:${card.stage || card.trainerType || card.energyType}`] += slot.quantity;

        

        if (cardCategory === "Pokemon") {
            for (const attack of card.attacks) {
                const cost = attack.cost ? attack.cost.length : 0;

                const indexToFind = cost >= 3 ? "3+" : cost.toString();

                const index = energyDist.findIndex(elem => {
                    return elem.name === indexToFind
                });

                energyDist[index].value++;
                energyDist[index].total += slot.quantity
            }

            if (card.stage === "Basic")
                basicCount += slot.quantity;
        }

        if (cardCategory === "Energy")
            energyCount += slot.quantity;
    }

    const basicChance = calcDrawOne(60, basicCount, 7);
    const energyChance = calcDrawOne(60, energyCount, 7);

    drawOdds.basic[0].value = basicChance;
    drawOdds.basic[1].value = 100 - basicChance;

    drawOdds.energy[0].value = energyChance;
    drawOdds.energy[1].value = 100 - energyChance;

    return { catComp, subcatComp, energyDist, drawOdds }
}

const calcDrawOne = (total, subgroup, sample) => {
    const remaining = total - subgroup;
    let result = 1;

    for (let i=0; i<sample; i++) {
        result *= (remaining - i) / (total - i);;
    }

    return (1 - result) * 100;
}
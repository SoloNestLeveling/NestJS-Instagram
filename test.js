
const user = [

    { id: 1, name: 'aa' },
    { id: 2, name: 'aa' },
    { id: 3, name: 'aa' },
];



const map = (iter, fn) => {

    const res = []

    for (const a of iter) {

        res.push(fn(a))
    }

    return res;
}

console.log(map(user, (user) => ({ ...user, name: "bb" })))


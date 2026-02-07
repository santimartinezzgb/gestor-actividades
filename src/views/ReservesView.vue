<template>
    <main>
        <h1>Extra Screen 2</h1>
        <p>This screen is ready for future reservation features.</p>
        <button @click="$router.push('/home')">Back to Home</button>
    </main>
</template>

<style scoped>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-color: #565656;
        color: white;
    }
    h1 { font-size: 3rem; }
    button {
        margin-top: 2rem;
        padding: 1rem 2rem;
        background-color: #F7B176;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
    }
</style>

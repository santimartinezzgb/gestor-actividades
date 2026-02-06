<script setup>
</script>

<template>
    <main>
            <section class="sectionTitle">
                <h1 id="title">MyFitness</h1>
                <p>Esto va a ser un eslogan</p>
            </section>
            
            <section class="inputs">
                <input type="text" placeholder="Usuario">
                <input type="password" placeholder="Contraseña">
            </section>
            
            <section class="sectionRemember">
                <input type="checkbox" id="remember">
                <label for="remember">Recuérdame</label>
            </section>
            <button class="btn_enter">Entrar</button>

    </main>

</template>

<style scoped>
    main {
        display: flex;
        width: 30vw;
        justify-content: center;
        flex-direction: column;
        align-items: left;
        height: 70vh;
        background-color: yellow;
    }

    .sectionTitle {
        margin-bottom: 2rem;
    }
    #title {
        font-size: 2rem;
        font-weight: 700;
    }
    .inputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .inputs input {
        padding: 0.5rem;
        font-size: 1.2rem;
        width: 50%;
        height: 6vh;
        border-radius: 0.3rem;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        border: none;
    }
    .sectionRemember {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    .btn_enter {
        padding: 0.5rem;
        font-weight: 600;
        font-size: 1.2rem;
        width: 20%;
        background-color: #F7B176;
        color: rgb(0, 0, 0);
        border: none;
        border-radius: 0.3rem;
        cursor: pointer;
    }
</style>
<script setup>

</script>


<template>
    <div class="main-image">
        <img src="../assets/main-image.svg" alt="Imagen de fitness" class="image" />
    </div>
</template>

<style scoped>
/* Ocupa la mitad derecha */
.main-image {
    width: 50vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image {
    width: 100%;
    max-width: 400px;
    height: auto;
}
</style>

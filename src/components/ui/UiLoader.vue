<template>
  <div class="loader">
    <div class="car-wrapper">
      <img src="/car-loader.png" alt="" class="car-img" />
      <svg class="headlights-svg" viewBox="0 0 80 80" preserveAspectRatio="none">
        <ellipse cx="22" cy="47" rx="8" ry="5" class="headlight headlight-left" />
        <ellipse cx="58" cy="47" rx="8" ry="5" class="headlight headlight-right" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.car-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.car-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.95;
}

.headlights-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.headlight {
  fill: #ffeb3b;
  animation: blink 0.5s ease-in-out infinite;
}


@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.15;
  }
}
</style>

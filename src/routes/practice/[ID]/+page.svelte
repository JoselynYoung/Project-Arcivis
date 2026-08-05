<script lang="ts">
  import { page } from '$app/state';
  import { Check, X, ArrowRight, RotateCcw } from '@lucide/svelte';
  import { practicePackages, questions } from '$lib/mocks/practice';

  const packageId = $derived(Number(page.params.ID));
  const pkg = $derived(practicePackages.find((p) => p.id === packageId) ?? null);
  const questionList = $derived(pkg ? (questions[pkg.id] ?? []) : []);

  let currentIndex = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let isSubmitted = $state(false);
  let correctCount = $state(0);

  let currentQuestion = $derived(questionList[currentIndex] ?? null);
  let isFinished = $derived(questionList.length === 0 || currentIndex >= questionList.length);

  function selectAnswer(index: number) {
    if (isSubmitted) return;
    selectedAnswer = index;
  }

  function submitAnswer() {
    if (selectedAnswer === null) return;
    isSubmitted = true;
    if (currentQuestion && selectedAnswer === currentQuestion.correctIndex) {
      correctCount += 1;
    }
  }

  function nextQuestion() {
    currentIndex += 1;
    selectedAnswer = null;
    isSubmitted = false;
  }

  function resetPackage() {
    currentIndex = 0;
    selectedAnswer = null;
    isSubmitted = false;
    correctCount = 0;
  }

  const totalDots = $derived(questionList.length);
</script>

<div class="w-full max-w-2xl mx-auto">
  {#if !pkg}
    <div class="text-center py-20">
      <p class="text-slate-500">Paket tidak ditemukan.</p>
    </div>
  {:else if !isFinished && currentQuestion}
    <!-- Quiz Header -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-slate-800">{pkg.title}</h1>
      <p class="text-sm text-slate-500">{pkg.description}</p>
      <div class="flex gap-4 mt-2 text-xs text-slate-400">
        <span>Kesulitan: {pkg.difficulty}</span>
        <span>{pkg.questionCount} Soal</span>
        <span>{pkg.duration}</span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-slate-500">
        Soal {currentIndex + 1} dari {questionList.length}
      </p>
      <div
        class="flex gap-1.5"
        role="progressbar"
        aria-label="Progress soal"
        aria-valuenow={currentIndex + 1}
        aria-valuemin="1"
        aria-valuemax={questionList.length}
      >
        {#each [...Array(totalDots).keys()] as i (i)}
          <span
            class="h-1.5 w-6 rounded-full {i <= currentIndex
              ? 'bg-primary-600'
              : 'bg-slate-200'}"
            aria-hidden="true"
          ></span>
        {/each}
      </div>
    </div>

    <!-- Question Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <p class="font-medium text-slate-800 mb-5">{currentQuestion.text}</p>

      <div class="flex flex-col gap-2 mb-5">
        {#each currentQuestion.options as option, i (i)}
          {#if !isSubmitted}
            <button
              type="button"
              onclick={() => selectAnswer(i)}
              class="text-left px-4 py-3 rounded-xl border text-sm transition-colors {selectedAnswer === i
                ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'}"
              aria-label={`Pilihan: ${option}`}
            >
              {option}
            </button>
          {:else}
            <div
              class="flex items-center justify-between px-4 py-3 rounded-xl border text-sm {i === currentQuestion.correctIndex
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 font-medium'
                : i === selectedAnswer
                  ? 'border-red-300 bg-red-50 text-red-700 font-medium'
                  : 'border-slate-200 text-slate-500'}"
            >
              {option}
              {#if i === currentQuestion.correctIndex}
                <Check size={16} class="text-emerald-600" aria-label="Benar" />
              {:else if i === selectedAnswer}
                <X size={16} class="text-red-600" aria-label="Salah" />
              {/if}
            </div>
          {/if}
        {/each}
      </div>

      {#if isSubmitted}
        <div class="bg-slate-50 rounded-xl p-4 mb-5" aria-live="polite" aria-atomic="true">
          <p class="text-xs font-semibold text-slate-500 mb-1">Pembahasan</p>
          <p class="text-sm text-slate-600">{currentQuestion.explanation}</p>
          {#if selectedAnswer === currentQuestion.correctIndex}
            <p class="text-emerald-600 text-sm font-medium mt-2">
              Jawaban kamu benar! ✅
            </p>
          {:else}
            <p class="text-red-600 text-sm font-medium mt-2">
              Jawaban kamu salah ❌
            </p>
          {/if}
        </div>
      {/if}

      {#if !isSubmitted}
        <button
          type="button"
          onclick={submitAnswer}
          disabled={selectedAnswer === null}
          class="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold disabled:bg-slate-200 disabled:text-slate-400 hover:bg-primary-700 transition-colors"
          aria-describedby="submit-hint"
        >
          Kumpulkan Jawaban
        </button>
        {#if selectedAnswer === null}
          <p id="submit-hint" class="text-xs text-slate-400 mt-2 text-center">
            Pilih jawaban terlebih dahulu
          </p>
        {/if}
      {:else}
        <button
          type="button"
          onclick={nextQuestion}
          class="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          Soal Berikutnya <ArrowRight size={16} />
        </button>
      {/if}
    </div>

  {:else if isFinished}
    <!-- Result Page -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
      <p class="text-sm text-slate-500 mb-2">{pkg.title} selesai</p>
      <p class="text-4xl font-bold text-primary-700 mb-1">
        {correctCount} / {questionList.length}
      </p>
      <p class="text-sm text-slate-500 mb-6">Jawaban benar</p>

      <button
        type="button"
        onclick={resetPackage}
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
      >
        <RotateCcw size={16} /> Ulangi Paket
      </button>
    </div>
  {/if}
</div>
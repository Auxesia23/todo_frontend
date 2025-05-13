<script lang="ts">
    import { Button } from '$lib/components/ui/button';
  </script>
  
  <section class="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
    <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
      Organize your life with <span class="text-primary">TodoEase</span>
    </h1>
    <p class="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
      A minimalist, fast, and beautiful todo manager to help you stay focused and productive.
    </p>
    <div class="mt-6 flex gap-4">
      <Button class="text-lg px-6 py-4">
        <a href="/todo">Get Started</a>
      </Button>
      <Button variant="outline" class="text-lg px-6 py-4">
        Learn More
      </Button>
    </div>
  </section>
  
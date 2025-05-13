<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let {form, data} = $props()

    onMount(() => {
      const registered = $page.url.searchParams.get('registered');
        if (registered === '1') {
          toast.success("SUCCESS", { description: "Register successful. Please log in." });
        }
    })

    async function googleLogin() {
      const resp = await fetch(`${data.API_BASE_URL}/auth/login/google`)
      const result = await resp.json()
      if (resp.ok) {
        window.location.href = result.url
      } else {
        toast.error("ERROR", {description : "Failed to get Google login URL"});
      }
    }
  </script>
  
  <form method="POST" class="flex h-screen w-full items-center justify-center px-4">
    <Card.Root class="mx-auto max-w-sm w-full">
      <Card.Header>
        <Card.Title class="text-2xl">Login</Card.Title>
        <Card.Description>
          Enter your email below to login to your account
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input name="email" id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input name="password" id="password" type="password" required />
          </div>
          {#if form?.error}
            <p class="text-sm text-red-500 mt-2">{form.error}</p>
          {/if}
          <Button type="submit" class="w-full">Login</Button>
          <Button onclick={() => googleLogin()} variant="outline" class="w-full">Login with Google</Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/register" class="underline"> Sign up </a>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
  
<script lang="ts">

	import * as Avatar from "$lib/components/ui/avatar/index.js";

	import Cloud from "@lucide/svelte/icons/cloud";
	import Github from "@lucide/svelte/icons/github";
	import Keyboard from "@lucide/svelte/icons/keyboard";
	import LifeBuoy from "@lucide/svelte/icons/life-buoy";
	import LogOut from "@lucide/svelte/icons/log-out";
	import Settings from "@lucide/svelte/icons/settings";
	import User from "@lucide/svelte/icons/user";
	
	
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	let {data, children } = $props();

	async function handleLogout() {
		const res = await fetch('/logout', { method: 'POST' });
		if (res.ok) {
			window.location.href = '/login';
		}
	}
</script>

<div class="min-h-screen flex flex-col">
	<!-- Navbar atau Header -->
	<div class="w-full flex justify-end p-4">
	  <DropdownMenu.Root>
		<DropdownMenu.Trigger>
		  <Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		  </Avatar.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
		  <DropdownMenu.Group>
			<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
			  <DropdownMenu.Item>
				<User class="mr-2 size-4" />
				<span>{data.user?.email}</span>
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			  </DropdownMenu.Item>
			  {#if data.user?.admin}
				<DropdownMenu.Item onclick={() => window.location.href="/logs"}>
					<Settings class="mr-2 size-4" />
					<span>Logs</span>
					<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			  {/if}
			  <DropdownMenu.Item>
				<Keyboard class="mr-2 size-4" />
				<span>Keyboard shortcuts</span>
				<DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
			  </DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
			  <Github class="mr-2 size-4" />
			  <span>GitHub</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
			  <LifeBuoy class="mr-2 size-4" />
			  <span>Support</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
			  <Cloud class="mr-2 size-4" />
			  <span>API</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={() => handleLogout()}>
				<LogOut  class="mr-2 size-4" />
				<span>Log out</span>
				<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		  </DropdownMenu.Group>
		</DropdownMenu.Content>
	  </DropdownMenu.Root>
	</div>
  
	<!-- Body -->
	<div class="flex-1">
	
	  {@render children()}
	</div>
  </div>
  
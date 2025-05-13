<script lang="ts">
    import '../app.css';
    let {children} = $props()

    import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
</script>


<ModeWatcher />
<Toaster />
{@render children()}
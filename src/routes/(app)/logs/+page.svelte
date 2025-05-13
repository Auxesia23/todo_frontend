
<script lang="ts">
    let {data} = $props()

    import * as Table from "$lib/components/ui/table/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { onMount } from "svelte";

    let logs = $state<LogEntry[]>([])
    let isLoading = $state<boolean>(false)

    async function fetchLogs() {
        isLoading = true
		const response = await fetch(`${data.API_BASE_URL}/logs`,{
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + data.token, 
			}},);
        const rawLogs = await response.json();
		logs = rawLogs.map((log: any) => ({
			...log,
			Timestamp: log.Timestamp
		}));
        isLoading = false
    }

    onMount(() => {
        fetchLogs()
    })
</script>
    
    <div class="container mx-auto px-4 py-8">
        <Table.Root>
            <Table.Caption class="mb-4 text-lg font-semibold">
                A list of recent log entries.
            </Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.Head>IP</Table.Head>
                    <Table.Head>Email</Table.Head>
                    <Table.Head>Path</Table.Head>
                    <Table.Head>Method</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Message</Table.Head>
                    <Table.Head>Duration</Table.Head>
                    <Table.Head>Timestamp</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#if isLoading}
                    {#each Array(5) as _, i}
                        <Table.Row>
                            {#each Array(8) as __}
                                <Table.Cell><Skeleton class="h-4 w-full" /></Table.Cell>
                            {/each}
                        </Table.Row>
                    {/each}
                {:else}
                    {#each logs as log}
                    <Table.Row>
                        <Table.Cell>{log.IP}</Table.Cell>
                        <Table.Cell>{log.Email}</Table.Cell>
                        <Table.Cell>{log.Path}</Table.Cell>
                        <Table.Cell>{log.Method}</Table.Cell>
                        <Table.Cell>{log.Status}</Table.Cell>
                        <Table.Cell>{log.Message}</Table.Cell>
                        <Table.Cell>{log.Duration}</Table.Cell>
                        <Table.Cell>{log.Timestamp}</Table.Cell>
                    </Table.Row>
                    {/each}
                {/if}
                    
            </Table.Body>
        </Table.Root>
    </div>
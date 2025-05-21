<script lang="ts">
    let { data } = $props()
    
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { toast } from "svelte-sonner";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";

    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import {
        type DateValue,
        DateFormatter,
        getLocalTimeZone,
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
    import { onMount } from "svelte";
 
    const df = new DateFormatter("en-US", {
        dateStyle: "long",
    });

    let dialogOpen = $state<boolean>(false);

    let deleteDialogOpen = $state<boolean>(false);
    let deleteTargetId = $state<number|null>(null);

    let isLoading = $state<boolean>(false);
    let addLoading = $state<boolean>(false)
    let deleteLoading = $state<boolean>(false)
    let editLoading = $state<boolean>(false)

    function confirmDelete(id: number) {
        deleteTargetId = id;
        deleteDialogOpen = true;
    }

    
    let value = $state<DateValue>();
    let title = $state<string>()
    let description = $state<string>()

    let todos : Todo[] = $state([])

    
   
    async function addTodo() {
        addLoading = true
        const dateString = formatDate(value)
        try {
            const response = await fetch(`${data.API_BASE_URL}/todo`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + data.token, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title : title,
                    due_date: dateString,
                    description : description
                    
                }),
            });

            const todo = await response.json()
            todos = [todo, ...todos];
    
            toast.success("SUCCESS",{ description: "New to do has been created"})
            dialogOpen = false
            addLoading = false
        } catch (error) {
            console.error('Error fetching todos:', error);
            addLoading = false
        }
    }


    async function updateStatus(id: number) {
        editLoading = true
        try {
            const response = await fetch(`${data.API_BASE_URL}/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + data.token,
                },
            });

            if (response.status !== 200) {
                toast.error("ERROR", { description: "Error updating todo" });
                return;
            }

            todos = todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );

            toast.success("SUCCESS", { description: "Todo status updated" });
            editLoading = false

        } catch (err) {
            console.error("Update status error:", err);
            toast.error("ERROR", { description: "Network error while updating todo" });
            editLoading = false
        }}

    async function deleteTodo(id: number | null) {
        deleteLoading = true
        try {
            const response = await fetch(`${data.API_BASE_URL}/todo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + data.token,
                },
            });

            deleteDialogOpen = false;

            if (response.status !== 204) {
                toast.error("ERROR", { description: "Error deleting todo" });
                return;
            }

            todos = todos.filter(todo => todo.id !== id);
            toast.success("SUCCESS", { description: "Todo deleted successfully" });
            deleteLoading = false

        } catch (err) {
            console.error("Delete todo error:", err);
            toast.error("ERROR", { description: "Network error while deleting todo" });
            deleteLoading = false
        }
    }


    function formatDate(dateValue: DateValue | null): string {
        if (!dateValue) return "";
        const date = dateValue.toDate(getLocalTimeZone());
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }


    async function fetchTodos() {
        try {
            isLoading = true
            const res = await fetch(`${data.API_BASE_URL}/todo`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + data.token,
                },
            });

            if (!res.ok) {
                toast.error("ERROR", { description: "Failed to load todos (server error)" });
                return;
            }

            const result = await res.json();
            todos = Array.isArray(result) ? result : [];
            isLoading = false

        } catch (err) {
            console.error("Error fetching todos:", err);
            toast.error("ERROR", { description: "Failed to load todos (network error)" });
            todos = []
        }
    }

    async function fetchActive() {
        try {
            isLoading = true
            const res = await fetch(`${data.API_BASE_URL}/todo?completed=0`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + data.token, 
                },
            });
            const result = await res.json();
            todos = Array.isArray(result) ? result : [];
            isLoading = false

        } catch (error) {
            console.error("Error fetching todos:", error);
            toast.error("ERROR", { description: "Failed to load todos (network error)" });
            todos = [];
        }
    }

    async function fetchCompleted() {
        try {
            isLoading = true
            const res = await fetch(`${data.API_BASE_URL}/todo?completed=1`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + data.token, 
                },
            });
            const result = await res.json();
            todos = Array.isArray(result) ? result : [];
            isLoading = false

        } catch (error) {
            console.error("Error fetching todos:", error);
		    toast.error("ERROR", { description: "Failed to load todos (network error)" });
            todos = [];
        }
    }
    
    onMount(() => {
        fetchTodos()
    })

   
</script>
<div class="mt-10 flex sticky top-10 z-10 justify-center">
    <Tabs.Root value="account" class="w-[400px]">
        <Tabs.List class="grid w-full grid-cols-3">
            <Tabs.Trigger onclick={fetchTodos} value="account">All</Tabs.Trigger>
            <Tabs.Trigger onclick={fetchActive} value="password">Active</Tabs.Trigger>
            <Tabs.Trigger onclick={fetchCompleted} value="password1">Completed</Tabs.Trigger>
        </Tabs.List>
    </Tabs.Root>
</div>



<div class="flex justify-center p-6">
    <div class="w-full max-w-3xl">
        <div class="mb-5 flex justify-end" >
            <Dialog.Root bind:open={dialogOpen}>
                <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
                  >Add Todo</Dialog.Trigger
                >
                <Dialog.Content class="sm:max-w-[425px]">
                  <Dialog.Header>
                    <Dialog.Title>Add Todo</Dialog.Title>
                    <Dialog.Description>
                      Input your todo here. Click save when you're done.
                    </Dialog.Description>
                  </Dialog.Header>
                  <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="title" class="text-right">Tittle</Label>
                      <Input bind:value={title} id="title"  class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="description" class="text-right">Description</Label>
                      <Textarea bind:value={description} id="description" class="col-span-3"  />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="date" class="text-right">Due Date</Label>
                        <Popover.Root>
                            <Popover.Trigger>
                              {#snippet child({ props })}
                                <Button
                                  variant="outline"
                                  class={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !value && "text-muted-foreground"
                                  )}
                                  {...props}
                                >
                                  <CalendarIcon class="mr-2 size-4" />
                                  {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
                                </Button>
                              {/snippet}
                            </Popover.Trigger>
                            <Popover.Content class="w-auto p-0">
                              <Calendar bind:value type="single" initialFocus />
                            </Popover.Content>
                          </Popover.Root>
                      </div>
                  </div>
                  <Dialog.Footer>
                    <Button onclick={addTodo} type="submit" disabled={addLoading}>
                        {addLoading ? 'Loading...' : 'Save'}
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
        </div>
        {#if isLoading}
        <div class="flex flex-col mb-4">
                <Card.Root>
                <Card.Header>
                    <Skeleton class="h-6 w-3/4 rounded-md" /> <!-- Title skeleton -->
                    <Skeleton class="h-4 w-1/2 mt-2 rounded-md" /> <!-- Description skeleton -->
                </Card.Header>
            
                <Card.Content class="space-y-3 mt-4">
                    <div class="space-y-2">
                    <Skeleton class="h-4 w-[200px] rounded-md" /> <!-- Due Date skeleton -->
                    <Skeleton class="h-4 w-[150px] rounded-md" /> <!-- Status skeleton -->
                    </div>
                </Card.Content>
            
                <Card.Footer class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
                    <Skeleton class="h-10 w-full sm:w-[180px] rounded-md" /> <!-- Button skeleton -->
                    <Skeleton class="h-10 w-full sm:w-[100px] rounded-md" /> <!-- Delete icon / button skeleton -->
                </Card.Footer>
                </Card.Root>
            </div>
        {:else if todos.length > 0}
            {#each todos as todo}
                <div class="flex flex-col mb-4">
                    <Card.Root>
                        <Card.Header>
                            <Card.Title class="text-xl font-semibold">{todo.title}</Card.Title>
                            <Card.Description class="text-md text-gray-600">{todo.description}</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-3">
                            <div class="text-sm text-gray-500">
                                <p><strong>Due Date:</strong> {new Date(todo.due_date).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {todo.completed ? 'Completed' : 'Active'}</p>
                            </div>
                        </Card.Content>
                        <Card.Footer>                   
                            {#if todo.completed}
                                <Button onclick={() => updateStatus(todo.id)} variant="outline" class="w-full mt-3">Undo</Button>
                            {:else}
                                <Button onclick={() => updateStatus(todo.id)} variant="outline" class="w-full mt-3">Mark as Completed</Button>
                            {/if}
                            <div class="ml-3 mt-3">
                                <AlertDialog.Root bind:open={deleteDialogOpen}>
                                    <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })} onclick={() => confirmDelete(todo.id)}>
                                        🗑
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Content>
                                      <AlertDialog.Header>
                                        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
                                        <AlertDialog.Description>
                                          This action cannot be undone. This will delete your todo.
                                        </AlertDialog.Description>
                                      </AlertDialog.Header>
                                      <AlertDialog.Footer>
                                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                                        <AlertDialog.Action disabled={deleteLoading} onclick={() => deleteTodo(deleteTargetId)}>{deleteLoading? "Loading..." : "Continue"}</AlertDialog.Action>
                                      </AlertDialog.Footer>
                                    </AlertDialog.Content>
                                  </AlertDialog.Root>
                            </div>
                        </Card.Footer>
                    </Card.Root>
                </div>
            {/each}
        {:else}              
            <p class="text-center text-sm text-gray-400">No todos found.</p>          
        {/if}
    </div>
</div>

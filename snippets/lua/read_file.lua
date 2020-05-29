local open = io.open

local function read_file(path)
    local file = open(path, "rb")

    if (not file) then return end

    local content = file:read("*a") -- Reads the whole file.
    file:close()
    return content
end

print(read_file("hello_world.lua")) -- >> print("Hello, world!")
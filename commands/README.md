These are custom nightwatch commands for midway server integration.

This path must be registered in the nightwatch.json file in `custom_commands_path`.

The commands available are used for controlling the mock server.

* setMockId: Set the mock id so the responses for mocked data could be sent from a specific folder. Usage: client.setMockId(`test1234`), where test1234 is a folder under ../mocked_data that contains mocked responses for a test case.
